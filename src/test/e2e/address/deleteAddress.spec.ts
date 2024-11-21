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

describe('Delete Address - (e2e)', () => {
  let companyToken: string
  let clientId: string
  let addressId: string

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

    const createAddressResponse = await request(app.server)
      .post('/address')
      .set('Authorization', `Bearer ${companyToken}`)
      .send({
        ...newAddressObject,
        clientId,
      })

    addressId = createAddressResponse.body.id
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return an error if trying to delete a non-existent address', async () => {
    const nonExistentAddressId = 'a6f5e7bc-23ad-41a3-aeae-123456789012'

    const response = await request(app.server)
      .delete(`/address/${nonExistentAddressId}`)
      .set('Authorization', `Bearer ${companyToken}`)

    expect(response.body).toEqual({
      message: addressNotFoundError.message,
      name: addressNotFoundError.name,
    })
    expect(response.statusCode).toEqual(404)
  })

  it('should delete the address and return the correct response', async () => {
    const response = await request(app.server)
      .delete(`/address/${addressId}`)
      .set('Authorization', `Bearer ${companyToken}`)

    expect(response.statusCode).toEqual(204)
    expect(response.body).toEqual({})
  })
})
