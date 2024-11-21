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

describe('Get Clients - (e2e)', () => {
  let companyToken: string

  const companyJokerRepository = setupCompanyJokerRepository()

  const authenticateCompanyMiddlewareError = new MiddlewareError({
    message: translate(TranslationKeysEnum.ERROR_TOKEN_MISSING),
    name: TranslationKeysEnum.ERROR_TOKEN_MISSING,
    statusCode: 401,
  })

  const newCompanyObject = createNewCompanyTestObject({
    CNPJ: '55555555555555',
    email: 'testclientlist@company.com',
  })

  const newClientObject1 = createNewClientTestObject()

  const newClientObject2 = createNewClientTestObject({
    name: 'Test Client 2',
    CPF: '10987654321',
    email: 'client2@test.com',
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

    await request(app.server)
      .post('/client')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(newClientObject1)

    await request(app.server)
      .post('/client')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(newClientObject2)
  })

  afterAll(async () => {
    await app.close()
  })

  it('should not allow getting clients if not authenticated', async () => {
    const response = await request(app.server).post('/client/list').send({})

    expect(response.statusCode).toEqual(
      authenticateCompanyMiddlewareError.statusCode,
    )
    expect(response.body).toEqual({
      message: authenticateCompanyMiddlewareError.message,
      name: authenticateCompanyMiddlewareError.name,
    })
  })

  it('should list clients and return the expected response structure', async () => {
    const response = await request(app.server)
      .post('/client/list')
      .set('Authorization', `Bearer ${companyToken}`)
      .send({})

    expect(response.body).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(String),
          companyId: expect.any(String),
          name: newClientObject1.name,
          CPF: newClientObject1.CPF,
          email: newClientObject1.email,
          phone: newClientObject1.phone,
        },
        {
          id: expect.any(String),
          companyId: expect.any(String),
          name: newClientObject2.name,
          CPF: newClientObject2.CPF,
          email: newClientObject2.email,
          phone: newClientObject2.phone,
        },
      ]),
    )
    expect(response.statusCode).toEqual(200)
  })
})
