import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { v4 as uuidv4 } from 'uuid'

import { app } from '@/app'
import {
  createNewAddressTestObject,
  createNewClientTestObject,
  createNewCompanyTestObject,
} from '@/test/testObjects/testObjects'
import { setupCompanyJokerRepository } from '@/test/utils/jokerRepository'
import { AddressNotFoundError } from '@/errors/addressNotFoundError'
import { ClientNotFoundError } from '@/errors/clientNotFoundError'

describe('Update Address - (e2e)', () => {
  let companyToken: string
  let companyId: string
  let clientId: string

  const companyJokerRepository = setupCompanyJokerRepository()

  const addressNotFoundError = new AddressNotFoundError()
  const clientNotFoundError = new ClientNotFoundError()

  const newCompanyObject = createNewCompanyTestObject({
    CNPJ: '11111111111111',
    email: 'company@test.com',
  })

  const newClientObject = createNewClientTestObject({
    name: 'Test Client',
    CPF: '12345678901',
    email: 'client@test.com',
    phone: '1234567890',
  })

  const newAddressObject = createNewAddressTestObject()

  beforeAll(async () => {
    await app.ready()

    const newCompany = await request(app.server)
      .post('/company')
      .send(newCompanyObject)

    companyId = newCompany.body.id

    const authenticateCompanyResponse = await request(app.server)
      .post('/company/authenticate')
      .send({
        CNPJ: newCompanyObject.CNPJ,
        password: newCompanyObject.password,
      })

    companyToken = authenticateCompanyResponse.body.token

    const newCompanyJoker = await companyJokerRepository.findByCNPJ(
      newCompanyObject.CNPJ,
    )

    await request(app.server)
      .patch('/email/confirm')
      .set('Authorization', `Bearer ${companyToken}`)
      .send({
        emailConfirmationCode: newCompanyJoker?.emailConfirmationCode,
      })

    const createClientResponse = await request(app.server)
      .post('/client')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(newClientObject)

    clientId = createClientResponse.body.id

    await request(app.server)
      .post('/address')
      .set('Authorization', `Bearer ${companyToken}`)
      .send({
        ...newAddressObject,
        clientId,
      })
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return an error if trying to update a non-existent client address', async () => {
    const nonExistentClientId = uuidv4()

    const response = await request(app.server)
      .patch('/address')
      .set('Authorization', `Bearer ${companyToken}`)
      .send({
        clientId: nonExistentClientId,
        city: 'New City',
      })

    expect(response.body.message).toEqual(clientNotFoundError.message)
    expect(response.statusCode).toEqual(404)
  })

  it('should return an error if trying to update a non-existent company address', async () => {
    const response = await request(app.server)
      .patch('/address')
      .set('Authorization', `Bearer ${companyToken}`)
      .send({
        city: 'New City',
      })

    expect(response.body.message).toEqual(addressNotFoundError.message)
    expect(response.statusCode).toEqual(404)
  })

  it('should return an error if client is not found', async () => {
    const invalidClientId = uuidv4()

    const response = await request(app.server)
      .patch('/address')
      .set('Authorization', `Bearer ${companyToken}`)
      .send({
        clientId: invalidClientId,
        city: 'New City',
      })

    expect(response.body.message).toEqual(clientNotFoundError.message)
    expect(response.statusCode).toEqual(404)
  })

  it('should be able to update the client address', async () => {
    const updatedAddressObject = createNewAddressTestObject({
      city: 'Updated City',
    })

    const response = await request(app.server)
      .patch('/address')
      .set('Authorization', `Bearer ${companyToken}`)
      .send({
        ...updatedAddressObject,
        clientId,
      })

    expect(response.body).toEqual({
      id: expect.any(String),
      country: newAddressObject.country,
      city: updatedAddressObject.city,
      state: newAddressObject.state,
      neighborhood: newAddressObject.neighborhood,
      street: newAddressObject.street,
      streetNumber: newAddressObject.streetNumber,
      zipCode: newAddressObject.zipCode,
      clientId,
      companyId: null,
    })

    expect(response.statusCode).toEqual(200)
  })

  it('should be able to update the company address', async () => {
    const updatedAddressObject = createNewAddressTestObject({
      city: 'Updated City',
    })

    await request(app.server)
      .post('/address')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(newAddressObject)

    const response = await request(app.server)
      .patch('/address')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(updatedAddressObject)

    expect(response.body).toEqual({
      id: expect.any(String),
      country: newAddressObject.country,
      city: updatedAddressObject.city,
      state: newAddressObject.state,
      neighborhood: newAddressObject.neighborhood,
      street: newAddressObject.street,
      streetNumber: newAddressObject.streetNumber,
      zipCode: newAddressObject.zipCode,
      companyId,
      clientId: null,
    })

    expect(response.statusCode).toEqual(200)
  })
})
