import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import {
  createNewClientTestObject,
  createNewCompanyTestObject,
} from '@/test/testObjects/testObjects'
import { setupCompanyJokerRepository } from '@/test/utils/jokerRepository'
import { MiddlewareError } from '@/errors/middlewareError'
import { translate } from '@/i18n/translate'
import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'

describe('Delete Client - (e2e)', () => {
  let companyToken: string
  let secondCompanyToken: string
  let clientId: string

  const companyJokerRepository = setupCompanyJokerRepository()

  const notAllowedError = new MiddlewareError({
    statusCode: 401,
    message: translate(TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED),
  })

  const newCompanyObject = createNewCompanyTestObject({
    CNPJ: '88888888888888',
    email: 'testcompany@deleteclient.com',
  })

  const secondCompanyObject = createNewCompanyTestObject({
    CNPJ: '99999999999999',
    email: 'secondcompany@deleteclient.com',
  })

  const newClientObject = createNewClientTestObject({
    name: 'Test Client',
    CPF: '12345678901',
    email: 'client@test.com',
    phone: '1234567890',
  })

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

    await request(app.server).post('/company').send(secondCompanyObject)

    const authenticateSecondCompanyResponse = await request(app.server)
      .post('/company/authenticate')
      .send({
        CNPJ: secondCompanyObject.CNPJ,
        password: secondCompanyObject.password,
      })

    secondCompanyToken = authenticateSecondCompanyResponse.body.token
  })

  afterAll(async () => {
    await app.close()
  })

  it('should not allow one company to delete a client from another company', async () => {
    const response = await request(app.server)
      .delete(`/client/${clientId}`)
      .set('Authorization', `Bearer ${secondCompanyToken}`)

    expect(response.body.message).toEqual(notAllowedError.message)
    expect(response.statusCode).toEqual(notAllowedError.statusCode)
  })

  it('should be able to delete a client', async () => {
    const response = await request(app.server)
      .delete(`/client/${clientId}`)
      .set('Authorization', `Bearer ${companyToken}`)

    expect(response.body).toEqual({ id: clientId })
    expect(response.statusCode).toEqual(200)
  })
})
