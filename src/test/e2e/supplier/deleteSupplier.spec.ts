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

describe('Delete Supplier - (e2e)', () => {
  let companyToken: string
  let secondCompanyToken: string
  let supplierId: string

  const companyJokerRepository = setupCompanyJokerRepository()

  const notAllowedError = new MiddlewareError({
    statusCode: 401,
    message: translate(TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED),
    name: TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED,
  })

  const newCompanyObject = createNewCompanyTestObject({
    CNPJ: '88888888888888',
    email: 'testcompany@deletesupplier.com',
  })

  const secondCompanyObject = createNewCompanyTestObject({
    CNPJ: '99999999999999',
    email: 'secondcompany@deletesupplier.com',
  })

  const newSupplierObject = createNewSupplierTestObject({
    name: 'Test Supplier',
    CNPJ: '12345678000123',
    CEP: '12345678',
    email: 'supplier@test.com',
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

    const createSupplierResponse = await request(app.server)
      .post('/supplier')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(newSupplierObject)

    supplierId = createSupplierResponse.body.id

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

  it('should not allow one company to delete a supplier from another company', async () => {
    const response = await request(app.server)
      .delete(`/supplier/${supplierId}`)
      .set('Authorization', `Bearer ${secondCompanyToken}`)

    expect(response.body).toEqual({
      message: notAllowedError.message,
      name: notAllowedError.name,
    })
    expect(response.statusCode).toEqual(notAllowedError.statusCode)
  })

  it('should be able to delete a supplier', async () => {
    const response = await request(app.server)
      .delete(`/supplier/${supplierId}`)
      .set('Authorization', `Bearer ${companyToken}`)

    expect(response.body).toEqual({ id: supplierId })
    expect(response.statusCode).toEqual(200)
  })
})
