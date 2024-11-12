import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import {
  createNewClientTestObject,
  createNewCompanyTestObject,
} from '@/test/testObjects/testObjects'
import { setupCompanyJokerRepository } from '@/test/utils/jokerRepository'
import { CPFAlreadyExistsError } from '@/errors/CPFAlreadyExistsError'
import { EmailAlreadyExistsError } from '@/errors/emailAlreadyExistsError'
import { MiddlewareError } from '@/errors/middlewareError'
import { translate } from '@/i18n/translate'
import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'

describe('Update Client - (e2e)', () => {
  let companyToken: string
  let secondCompanyToken: string
  let clientId: string

  const companyJokerRepository = setupCompanyJokerRepository()

  const cpfAlreadyExistsError = new CPFAlreadyExistsError()
  const emailAlreadyExistsError = new EmailAlreadyExistsError()
  const notAllowedError = new MiddlewareError({
    statusCode: 401,
    message: translate(TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED),
  })

  const newCompanyObject = createNewCompanyTestObject({
    CNPJ: '88888888888888',
    email: 'testcompany@updateclient.com',
  })

  const secondCompanyObject = createNewCompanyTestObject({
    CNPJ: '99999999999999',
    email: 'secondcompany@updateclient.com',
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

  it('should not be able to update a client with an already existing CPF', async () => {
    const updateClientObject = createNewClientTestObject({
      name: 'Updated Client',
      CPF: newClientObject.CPF,
      email: 'updatedclient@test.com',
      phone: '1111111111',
    })

    const response = await request(app.server)
      .patch(`/client/${clientId}`)
      .set('Authorization', `Bearer ${companyToken}`)
      .send(updateClientObject)

    expect(response.body.message).toEqual(cpfAlreadyExistsError.message)
    expect(response.statusCode).toEqual(409)
  })

  it('should not be able to update a client with an already existing email', async () => {
    const updateClientObject = createNewClientTestObject({
      name: 'Updated Client',
      CPF: '98765432109',
      email: newClientObject.email,
      phone: '1111111111',
    })

    const response = await request(app.server)
      .patch(`/client/${clientId}`)
      .set('Authorization', `Bearer ${companyToken}`)
      .send(updateClientObject)

    expect(response.body.message).toEqual(emailAlreadyExistsError.message)
    expect(response.statusCode).toEqual(409)
  })

  it('should not allow one company to update a client from another company', async () => {
    const updateClientObject = createNewClientTestObject({
      name: 'Updated Client',
      CPF: '98765432109',
      email: 'updatedclient@test.com',
      phone: '1111111111',
    })

    const response = await request(app.server)
      .patch(`/client/${clientId}`)
      .set('Authorization', `Bearer ${secondCompanyToken}`)
      .send(updateClientObject)

    expect(response.body.message).toEqual(notAllowedError.message)
    expect(response.statusCode).toEqual(notAllowedError.statusCode)
  })

  it('should be able to update a client and return the correct structure', async () => {
    const updateClientObject = createNewClientTestObject({
      name: 'Updated Client',
      CPF: '98765432100',
      email: 'updatedclient@test.com',
      phone: '1111111111',
    })

    const response = await request(app.server)
      .patch(`/client/${clientId}`)
      .set('Authorization', `Bearer ${companyToken}`)
      .send(updateClientObject)

    expect(response.body).toEqual({
      id: clientId,
      name: updateClientObject.name,
      CPF: updateClientObject.CPF,
      email: updateClientObject.email,
      phone: updateClientObject.phone,
    })
    expect(response.statusCode).toEqual(200)
  })
})
