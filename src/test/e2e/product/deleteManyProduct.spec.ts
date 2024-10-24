import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { v4 as uuidv4 } from 'uuid'

import { app } from '@/app'
import {
  createNewCompanyTestObject,
  createNewProductTestObject,
} from '@/test/testObjects/testObjects'
import { setupCompanyJokerRepository } from '@/test/utils/jokerRepository'
import { MiddlewareError } from '@/errors/middlewareError'

describe('Delete many products - (e2e)', () => {
  let companyToken: string
  let otherCompanyToken: string
  let productId1: string
  let productId2: string

  const companyJokerRepository = setupCompanyJokerRepository()

  const authenticateCompanyMiddlewareError = new MiddlewareError({
    message: 'Token missing!',
    statusCode: 401,
  })

  const newCompanyObject = createNewCompanyTestObject({
    CNPJ: '11111111111111',
    email: 'test@company.com',
  })

  const otherCompanyObject = createNewCompanyTestObject({
    CNPJ: '22222222222222',
    email: 'other@company.com',
  })

  const newProductObject1 = createNewProductTestObject()
  const newProductObject2 = createNewProductTestObject()

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

    const createProductResponse1 = await request(app.server)
      .post('/product')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(newProductObject1)

    const createProductResponse2 = await request(app.server)
      .post('/product')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(newProductObject2)

    productId1 = createProductResponse1.body.id
    productId2 = createProductResponse2.body.id

    await request(app.server).post('/company').send(otherCompanyObject)

    const authenticateOtherCompanyResponse = await request(app.server)
      .post('/company/authenticate')
      .send({
        CNPJ: otherCompanyObject.CNPJ,
        password: otherCompanyObject.password,
      })

    otherCompanyToken = authenticateOtherCompanyResponse.body.token
  })

  afterAll(async () => {
    await app.close()
  })

  it('should delete multiple products from the authenticated company', async () => {
    const response = await request(app.server)
      .post('/product/delete-by-ids')
      .set('Authorization', `Bearer ${companyToken}`)
      .send({ ids: [productId1, productId2] })

    expect(response.body.count).toEqual(2)
    expect(response.statusCode).toEqual(200)
  })

  it('should not allow deleting products that belong to another company', async () => {
    const response = await request(app.server)
      .post('/product/delete-by-ids')
      .set('Authorization', `Bearer ${otherCompanyToken}`)
      .send({ ids: [productId1, productId2] })

    expect(response.body.message).toEqual(
      'Prerequisite for this action: email confirmation.',
    )
    expect(response.statusCode).toEqual(401)
  })

  it('should not allow deleting products without authentication', async () => {
    const response = await request(app.server)
      .post('/product/delete-by-ids')
      .send({ ids: [productId1, productId2] })

    expect(response.body.message).toEqual(
      authenticateCompanyMiddlewareError.message,
    )
    expect(response.statusCode).toEqual(
      authenticateCompanyMiddlewareError.statusCode,
    )
  })

  it('should return error when trying to delete non-existent products', async () => {
    const nonExistentProductIds = [uuidv4(), uuidv4()]

    const response = await request(app.server)
      .post('/product/delete-by-ids')
      .set('Authorization', `Bearer ${companyToken}`)
      .send({ ids: nonExistentProductIds })

    expect(response.body.count).toEqual(0)
    expect(response.statusCode).toEqual(200)
  })
})
