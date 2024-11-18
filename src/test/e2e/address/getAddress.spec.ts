import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import {
  createNewAddressTestObject,
  createNewClientTestObject,
  createNewCompanyTestObject,
} from '@/test/testObjects/testObjects'
import { setupCompanyJokerRepository } from '@/test/utils/jokerRepository'
import { AddressNotFoundError } from '@/errors/addressNotFoundError'

describe('Get Address - (e2e)', () => {
  let companyToken: string
  let clientId: string

  const companyJokerRepository = setupCompanyJokerRepository()

  const addressNotFoundError = new AddressNotFoundError()

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

    await request(app.server).post('/company').send(newCompanyObject)

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

  it('should return an error if no address is found', async () => {
    const nonExistentClientId = 'a6f5e7bc-23ad-41a3-aeae-123456789012'

    const response = await request(app.server)
      .post('/address/list')
      .set('Authorization', `Bearer ${companyToken}`)
      .send({ clientId: nonExistentClientId })

    expect(response.body.message).toEqual(addressNotFoundError.message)
    expect(response.statusCode).toEqual(404)
  })

  it('should return address and match the expected structure', async () => {
    const response = await request(app.server)
      .post('/address/list')
      .set('Authorization', `Bearer ${companyToken}`)
      .send({ clientId })

    expect(response.body).toEqual({
      id: expect.any(String),
      country: newAddressObject.country,
      city: newAddressObject.city,
      state: newAddressObject.state,
      neighborhood: newAddressObject.neighborhood,
      street: newAddressObject.street,
      streetNumber: newAddressObject.streetNumber,
      zipCode: newAddressObject.zipCode,
      clientId,
      companyId: expect.any(String),
    })

    expect(response.statusCode).toEqual(200)
  })
})
