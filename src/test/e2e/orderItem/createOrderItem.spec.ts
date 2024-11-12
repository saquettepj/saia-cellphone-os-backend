import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { v4 as uuidv4 } from 'uuid'

import { app } from '@/app'
import {
  createNewClientTestObject,
  createNewCompanyTestObject,
  createNewEmployeeTestObject,
  createNewOrderItemTestObject,
  createNewOrderTestObject,
  createNewProductTestObject,
} from '@/test/testObjects/testObjects'
import {
  setupCompanyJokerRepository,
  setupProductJokerRepository,
} from '@/test/utils/jokerRepository'
import { MiddlewareError } from '@/errors/middlewareError'
import { DuplicateOrderItemError } from '@/errors/duplicateOrderItemError'
import { translate } from '@/i18n/translate'
import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'

describe('Create OrderItem - (e2e)', () => {
  let companyToken: string
  let initialProductQuantity: number | undefined
  let clientId: string
  let employeeId: string
  let productId: string
  let secondProductId: string
  let orderId: string

  const companyJokerRepository = setupCompanyJokerRepository()
  const productJokerRepository = setupProductJokerRepository()

  const newCompanyObject = createNewCompanyTestObject({
    CNPJ: '11111111111111',
    email: 'company@test.com',
  })

  const duplicateOrderItemError = new DuplicateOrderItemError()

  const orderNotFoundError = new MiddlewareError({
    statusCode: 404,
    message: translate(TranslationKeysEnum.ERROR_ORDER_NOT_FOUND),
  })

  const productNotFoundError = new MiddlewareError({
    message: translate(TranslationKeysEnum.ERROR_PRODUCT_NOT_FOUND),
    statusCode: 404,
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
      .send(createNewClientTestObject())

    clientId = createClientResponse.body.id

    const createEmployeeResponse = await request(app.server)
      .post('/employee')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(createNewEmployeeTestObject())

    employeeId = createEmployeeResponse.body.id

    const createProductResponse = await request(app.server)
      .post('/product')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(createNewProductTestObject())

    productId = createProductResponse.body.id

    const secondProductResponse = await request(app.server)
      .post('/product')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(createNewProductTestObject())

    secondProductId = secondProductResponse.body.id

    const newProductJoker = await productJokerRepository.findById(productId)
    initialProductQuantity = newProductJoker?.quantity

    const orderData = createNewOrderTestObject({
      clientId,
      employeeId,
      orderItems: [{ productId, quantity: 2 }],
    })

    const createOrderResponse = await request(app.server)
      .post('/order')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(orderData)

    orderId = createOrderResponse.body.id
  })

  afterAll(async () => {
    await app.close()
  })

  it('should not allow creating an OrderItem for a non-existent order', async () => {
    const invalidOrderId = uuidv4()
    const orderItemData = createNewOrderItemTestObject({
      orderId: invalidOrderId,
      productId,
      quantity: 1,
    })

    const response = await request(app.server)
      .post('/order-item')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(orderItemData)

    expect(response.body.message).toEqual(orderNotFoundError.message)
    expect(response.statusCode).toEqual(orderNotFoundError.statusCode)
  })

  it('should not allow creating an OrderItem with a non-existent product', async () => {
    const invalidProductId = uuidv4()
    const orderItemData = createNewOrderItemTestObject({
      orderId,
      productId: invalidProductId,
      quantity: 1,
    })

    const response = await request(app.server)
      .post('/order-item')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(orderItemData)

    expect(response.body.message).toEqual(productNotFoundError.message)
    expect(response.statusCode).toEqual(productNotFoundError.statusCode)
  })

  it('should not allow creating a duplicate OrderItem for the same product in the same order', async () => {
    const orderItemData = createNewOrderItemTestObject({
      orderId,
      productId,
      quantity: 1,
    })

    await request(app.server)
      .post('/order-item')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(orderItemData)

    const response = await request(app.server)
      .post('/order-item')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(orderItemData)

    expect(response.body.message).toEqual(duplicateOrderItemError.message)
    expect(response.statusCode).toEqual(400)
  })

  it('should create an OrderItem and update the product quantity accordingly', async () => {
    const quantityToReduce = 1
    const orderItemData = createNewOrderItemTestObject({
      orderId,
      productId: secondProductId,
      quantity: quantityToReduce,
    })

    const createdProduct =
      await productJokerRepository.findById(secondProductId)

    const response = await request(app.server)
      .post('/order-item')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(orderItemData)

    expect(response.body).toEqual({
      id: expect.any(String),
      orderId,
      productId: secondProductId,
      quantity: quantityToReduce,
      initialQuantity: createdProduct?.quantity,
    })
    expect(response.statusCode).toEqual(201)

    const updatedProduct =
      await productJokerRepository.findById(secondProductId)

    expect(updatedProduct?.quantity).toEqual(
      Math.max(initialProductQuantity! - quantityToReduce, 0),
    )
  })
})
