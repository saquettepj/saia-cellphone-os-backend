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

describe('Create Supplier - (e2e)', () => {
  let companyToken: string

  const companyJokerRepository = setupCompanyJokerRepository()

  const cnpjAlreadyExistsError = new CNPJAlreadyExistsError()
  const emailAlreadyExistsError = new EmailAlreadyExistsError()

  const newCompanyObject = createNewCompanyTestObject({
    CNPJ: '44444444444444',
    email: 'testcompany@company.com',
  })

  const newSupplierObject = createNewSupplierTestObject()

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
  })

  afterAll(async () => {
    await app.close()
  })

  it('should not be able to create a supplier with an already used CNPJ', async () => {
    await request(app.server)
      .post('/supplier')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(newSupplierObject)

    const response = await request(app.server)
      .post('/supplier')
      .set('Authorization', `Bearer ${companyToken}`)
      .send({ ...newSupplierObject, email: 'newemail@test.com' })

    expect(response.body.message).toEqual(cnpjAlreadyExistsError.message)
    expect(response.statusCode).toEqual(409)
  })

  it('should not be able to create a supplier with an already used email', async () => {
    await request(app.server)
      .post('/supplier')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(newSupplierObject)

    const response = await request(app.server)
      .post('/supplier')
      .set('Authorization', `Bearer ${companyToken}`)
      .send({ ...newSupplierObject, CNPJ: '98765432000109' })

    expect(response.body.message).toEqual(emailAlreadyExistsError.message)
    expect(response.statusCode).toEqual(409)
  })

  it('should be able to create a supplier and return the correct response structure', async () => {
    const supplierObject = {
      name: 'New Supplier',
      CNPJ: '98765432000109',
      CEP: '12345678',
      email: 'newsupplier@test.com',
      phone: '0987654321',
    }

    const response = await request(app.server)
      .post('/supplier')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(supplierObject)

    expect(response.body).toEqual({
      id: expect.any(String),
      companyId: expect.any(String),
      name: supplierObject.name,
      CNPJ: supplierObject.CNPJ,
      CEP: supplierObject.CEP,
      email: supplierObject.email,
      phone: supplierObject.phone,
    })
    expect(response.statusCode).toEqual(201)
  })
})
