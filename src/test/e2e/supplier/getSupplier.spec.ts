import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import {
  createNewCompanyTestObject,
  createNewSupplierTestObject,
} from '@/test/testObjects/testObjects'
import { setupCompanyJokerRepository } from '@/test/utils/jokerRepository'
import { MiddlewareError } from '@/errors/middlewareError'
import { translate } from '@/i18n/translate'
import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'

describe('Get Suppliers - (e2e)', () => {
  let companyToken: string

  const companyJokerRepository = setupCompanyJokerRepository()

  const authenticateCompanyMiddlewareError = new MiddlewareError({
    message: translate(TranslationKeysEnum.ERROR_TOKEN_MISSING),
    name: TranslationKeysEnum.ERROR_TOKEN_MISSING,
    statusCode: 401,
  })

  const newCompanyObject = createNewCompanyTestObject({
    CNPJ: '55555555555555',
    email: 'testsupplierlist@company.com',
  })

  const newSupplierObject1 = createNewSupplierTestObject()

  const newSupplierObject2 = createNewSupplierTestObject({
    name: 'Test Supplier 2',
    CNPJ: '10987654000123',
    CEP: '87654321',
    email: 'supplier2@test.com',
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
      .post('/supplier')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(newSupplierObject1)

    await request(app.server)
      .post('/supplier')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(newSupplierObject2)
  })

  afterAll(async () => {
    await app.close()
  })

  it('should not allow getting suppliers if not authenticated', async () => {
    const response = await request(app.server).post('/supplier/list').send({})

    expect(response.statusCode).toEqual(
      authenticateCompanyMiddlewareError.statusCode,
    )
    expect(response.body).toEqual({
      message: authenticateCompanyMiddlewareError.message,
      name: authenticateCompanyMiddlewareError.name,
    })
  })

  it('should list suppliers and return the expected response structure', async () => {
    const response = await request(app.server)
      .post('/supplier/list')
      .set('Authorization', `Bearer ${companyToken}`)
      .send({})

    expect(response.body).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(String),
          companyId: expect.any(String),
          name: newSupplierObject1.name,
          CNPJ: newSupplierObject1.CNPJ,
          CEP: newSupplierObject1.CEP,
          email: newSupplierObject1.email,
          phone: newSupplierObject1.phone,
        },
        {
          id: expect.any(String),
          companyId: expect.any(String),
          name: newSupplierObject2.name,
          CNPJ: newSupplierObject2.CNPJ,
          CEP: newSupplierObject2.CEP,
          email: newSupplierObject2.email,
          phone: newSupplierObject2.phone,
        },
      ]),
    )
    expect(response.statusCode).toEqual(200)
  })
})
