import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { v4 as uuidv4 } from 'uuid'

import { app } from '@/app'
import {
  createNewClientTestObject,
  createNewCompanyTestObject,
  createNewEmployeeTestObject,
  createNewOrderTestObject,
  createNewProductTestObject,
} from '@/test/testObjects/testObjects'
import {
  setupCompanyJokerRepository,
  setupProductJokerRepository,
} from '@/test/utils/jokerRepository'
import { MiddlewareError } from '@/errors/middlewareError'
import { translate } from '@/i18n/translate'
import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'

describe('Delete OrderItem - (e2e)', () => {
  let companyToken: string
  let clientId: string
  let employeeId: string
  let productId: string
  let orderId: string
  let orderItemId: string

  const companyJokerRepository = setupCompanyJokerRepository()

  const newCompanyObject = createNewCompanyTestObject({
    CNPJ: '11111111111111',
    email: 'company@test.com',
  })

  const orderItemNotFoundError = new MiddlewareError({
    statusCode: 404,
    message: translate(TranslationKeysEnum.ERROR_ORDER_ITEM_NOT_FOUND),
    name: TranslationKeysEnum.ERROR_ORDER_ITEM_NOT_FOUND,
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

    const listOrderItemsResponse = await request(app.server)
      .post('/order-item/list')
      .set('Authorization', `Bearer ${companyToken}`)
      .send({ orderId })

    orderItemId = listOrderItemsResponse.body.orderItems[0].id
  })

  afterAll(async () => {
    await app.close()
  })

  it('should not allow deleting a non-existent OrderItem', async () => {
    const invalidOrderItemId = uuidv4()

    const response = await request(app.server)
      .delete(`/order-item/${invalidOrderItemId}`)
      .set('Authorization', `Bearer ${companyToken}`)

    expect(response.body).toEqual({
      message: orderItemNotFoundError.message,
      name: orderItemNotFoundError.name,
    })
    expect(response.statusCode).toEqual(orderItemNotFoundError.statusCode)
  })

  it('should delete an existing OrderItem and return the expected result', async () => {
    const response = await request(app.server)
      .delete(`/order-item/${orderItemId}`)
      .set('Authorization', `Bearer ${companyToken}`)

    expect(response.body).toEqual({
      id: orderItemId,
    })
    expect(response.statusCode).toEqual(200)
  })
})
