import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import {
  createNewCompanyTestObject,
  createNewProductTestObject,
} from '@/test/testObjects/testObjects'
import { setupCompanyJokerRepository } from '@/test/utils/jokerRepository'
import { MiddlewareError } from '@/errors/middlewareError'

describe('Create product - (e2e)', () => {
  let validToken: string

  const companyJokerRepository = setupCompanyJokerRepository()

  const authenticateCompanyMiddlewareError = new MiddlewareError({
    message: 'Invalid token!',
    statusCode: 401,
  })

  beforeAll(async () => {
    await app.ready()

    const newCompanyObject = createNewCompanyTestObject({
      CNPJ: '11111111111111',
      email: 'valid@company.com',
    })

    await request(app.server).post('/company').send(newCompanyObject)

    const authenticateCompanyResponse = await request(app.server)
      .post('/company/authenticate')
      .send({
        CNPJ: newCompanyObject.CNPJ,
        password: newCompanyObject.password,
      })

    validToken = authenticateCompanyResponse.body.token

    const company = await companyJokerRepository.findByCNPJ(
      newCompanyObject.CNPJ,
    )

    await request(app.server)
      .patch(`/email/confirm`)
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        emailConfirmationCode: company?.emailConfirmationCode,
      })
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a product with all attributes', async () => {
    const newProductObject = createNewProductTestObject()

    const response = await request(app.server)
      .post('/product')
      .set('Authorization', `Bearer ${validToken}`)
      .send(newProductObject)

    expect(response.body).toEqual({
      id: expect.any(String),
      companyId: expect.any(String),
      type: newProductObject.type,
      condition: newProductObject.condition,
      description: newProductObject.description,
      price: newProductObject.price,
    })
    expect(response.statusCode).toEqual(201)
  })

  it('should not allow product creation without email confirmation', async () => {
    const newProductObject = createNewProductTestObject()

    const unconfirmedCompanyObject = createNewCompanyTestObject({
      CNPJ: '33333333333333',
      email: 'unconfirmed@company.com',
    })

    await request(app.server).post('/company').send(unconfirmedCompanyObject)

    const unconfirmedAuthResponse = await request(app.server)
      .post('/company/authenticate')
      .send({
        CNPJ: unconfirmedCompanyObject.CNPJ,
        password: unconfirmedCompanyObject.password,
      })

    const unconfirmedToken = unconfirmedAuthResponse.body.token

    const response = await request(app.server)
      .post('/product')
      .set('Authorization', `Bearer ${unconfirmedToken}`)
      .send(newProductObject)

    expect(response.body.message).toEqual(
      'Prerequisite for this action: email confirmation.',
    )
    expect(response.statusCode).toEqual(401)
  })

  it('should not allow product creation with an invalid authentication token', async () => {
    const newProductObject = createNewProductTestObject()

    const response = await request(app.server)
      .post('/product')
      .set('Authorization', `Bearer invalidtoken`)
      .send(newProductObject)

    expect(response.body.message).toEqual(
      authenticateCompanyMiddlewareError.message,
    )
    expect(response.statusCode).toEqual(
      authenticateCompanyMiddlewareError.statusCode,
    )
  })
})
