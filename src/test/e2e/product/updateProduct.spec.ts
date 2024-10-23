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

describe('Update product - (e2e)', () => {
  let companyToken: string
  let otherCompanyToken: string
  let productId: string

  const companyJokerRepository = setupCompanyJokerRepository()

  const authenticateCompanyMiddlewareError = new MiddlewareError({
    message: 'Token missing!',
    statusCode: 401,
  })

  const productCheckerByCompanyMiddleware1 = new MiddlewareError({
    statusCode: 401,
    message: 'Request not allowed!',
  })

  const productCheckerByCompanyMiddleware2 = new MiddlewareError({
    statusCode: 404,
    message: 'Product not found!',
  })

  const newCompanyObject = createNewCompanyTestObject({
    CNPJ: '11111111111111',
    email: 'test@company.com',
  })

  const otherCompanyObject = createNewCompanyTestObject({
    CNPJ: '22222222222222',
    email: 'other@company.com',
  })

  const newProductObject = createNewProductTestObject()

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

    const createProductResponse = await request(app.server)
      .post('/product')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(newProductObject)

    productId = createProductResponse.body.id

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

  it('should be able to update a product with all attributes', async () => {
    const updateProductObject = {
      type: 'PRODUCT',
      price: 150.0,
      condition: 'NEW',
      description: 'Updated description',
      quantity: 10,
    }

    const response = await request(app.server)
      .patch(`/product/${productId}`)
      .set('Authorization', `Bearer ${companyToken}`)
      .send(updateProductObject)

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      id: productId,
      companyId: expect.any(String),
      type: updateProductObject.type,
      condition: updateProductObject.condition,
      description: updateProductObject.description,
      price: updateProductObject.price,
      quantity: updateProductObject.quantity,
    })
  })

  it('should return error when updating a non-existent product', async () => {
    const nonExistentProductId = uuidv4()

    const updateProductObject = {
      type: 'PRODUCT',
      price: 150.0,
      condition: 'NEW',
      description: 'Updated description',
      quantity: 10,
    }

    const response = await request(app.server)
      .patch(`/product/${nonExistentProductId}`)
      .set('Authorization', `Bearer ${companyToken}`)
      .send(updateProductObject)

    expect(response.statusCode).toEqual(
      productCheckerByCompanyMiddleware2.statusCode,
    )
    expect(response.body.message).toEqual(
      productCheckerByCompanyMiddleware2.message,
    )
  })

  it('should not allow updating a product that belongs to another company', async () => {
    const updateProductObject = {
      type: 'PRODUCT',
      price: 150.0,
      condition: 'NEW',
      description: 'Updated description',
      quantity: 10,
    }

    const response = await request(app.server)
      .patch(`/product/${productId}`)
      .set('Authorization', `Bearer ${otherCompanyToken}`)
      .send(updateProductObject)

    expect(response.statusCode).toEqual(
      productCheckerByCompanyMiddleware1.statusCode,
    )
    expect(response.body.message).toEqual(
      productCheckerByCompanyMiddleware1.message,
    )
  })

  it('should not allow updating a product without authentication', async () => {
    const updateProductObject = {
      type: 'PRODUCT',
      price: 150.0,
      condition: 'NEW',
      description: 'Updated description',
      quantity: 10,
    }

    const response = await request(app.server)
      .patch(`/product/${productId}`)
      .send(updateProductObject)

    expect(response.statusCode).toEqual(
      authenticateCompanyMiddlewareError.statusCode,
    )
    expect(response.body.message).toEqual(
      authenticateCompanyMiddlewareError.message,
    )
  })
})
