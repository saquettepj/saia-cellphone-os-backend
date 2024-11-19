import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import {
  createNewCompanyTestObject,
  createNewSupplierTestObject,
} from '@/test/testObjects/testObjects'
import { setupCompanyJokerRepository } from '@/test/utils/jokerRepository'
import { CNPJAlreadyExistsError } from '@/errors/CNPJAlreadyExistsError'
import { EmailAlreadyExistsError } from '@/errors/emailAlreadyExistsError'
import { MiddlewareError } from '@/errors/middlewareError'
import { translate } from '@/i18n/translate'
import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'

describe('Update Supplier - (e2e)', () => {
  let companyToken: string
  let secondCompanyToken: string
  let supplierId: string

  const companyJokerRepository = setupCompanyJokerRepository()

  const cnpjAlreadyExistsError = new CNPJAlreadyExistsError()
  const emailAlreadyExistsError = new EmailAlreadyExistsError()
  const notAllowedError = new MiddlewareError({
    statusCode: 401,
    message: translate(TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED),
  })

  const newCompanyObject = createNewCompanyTestObject({
    CNPJ: '88888888888888',
    email: 'testcompany@updatesupplier.com',
  })

  const secondCompanyObject = createNewCompanyTestObject({
    CNPJ: '99999999999999',
    email: 'secondcompany@updatesupplier.com',
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

  it('should not be able to update a supplier with an already existing CNPJ', async () => {
    const updateSupplierObject = createNewSupplierTestObject({
      name: 'Updated Supplier',
      CNPJ: newSupplierObject.CNPJ,
      CEP: '87654321',
      email: 'updatedsupplier@test.com',
      phone: '1111111111',
    })

    const response = await request(app.server)
      .patch(`/supplier/${supplierId}`)
      .set('Authorization', `Bearer ${companyToken}`)
      .send(updateSupplierObject)

    expect(response.body.message).toEqual(cnpjAlreadyExistsError.message)
    expect(response.statusCode).toEqual(409)
  })

  it('should not be able to update a supplier with an already existing email', async () => {
    const updateSupplierObject = createNewSupplierTestObject({
      name: 'Updated Supplier',
      CNPJ: '98765432000109',
      CEP: '87654321',
      email: newSupplierObject.email,
      phone: '1111111111',
    })

    const response = await request(app.server)
      .patch(`/supplier/${supplierId}`)
      .set('Authorization', `Bearer ${companyToken}`)
      .send(updateSupplierObject)

    expect(response.body.message).toEqual(emailAlreadyExistsError.message)
    expect(response.statusCode).toEqual(409)
  })

  it('should not allow one company to update a supplier from another company', async () => {
    const updateSupplierObject = createNewSupplierTestObject({
      name: 'Updated Supplier',
      CNPJ: '98765432000109',
      CEP: '87654321',
      email: 'updatedsupplier@test.com',
      phone: '1111111111',
    })

    const response = await request(app.server)
      .patch(`/supplier/${supplierId}`)
      .set('Authorization', `Bearer ${secondCompanyToken}`)
      .send(updateSupplierObject)

    expect(response.body.message).toEqual(notAllowedError.message)
    expect(response.statusCode).toEqual(notAllowedError.statusCode)
  })

  it('should be able to update a supplier and return the correct structure', async () => {
    const updateSupplierObject = createNewSupplierTestObject({
      name: 'Updated Supplier',
      CNPJ: '98765432000100',
      CEP: '87654321',
      email: 'updatedsupplier@test.com',
      phone: '1111111111',
    })

    const response = await request(app.server)
      .patch(`/supplier/${supplierId}`)
      .set('Authorization', `Bearer ${companyToken}`)
      .send(updateSupplierObject)

    expect(response.body).toEqual({
      id: supplierId,
      name: updateSupplierObject.name,
      CNPJ: updateSupplierObject.CNPJ,
      CEP: updateSupplierObject.CEP,
      email: updateSupplierObject.email,
      phone: updateSupplierObject.phone,
    })
    expect(response.statusCode).toEqual(200)
  })
})
