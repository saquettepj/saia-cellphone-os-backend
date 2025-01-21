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
import { OrderItemNotFoundError } from '@/errors/orderItemNotFoundError'

describe.skip('Delete Many OrderItems - (e2e)', () => {
  let companyToken: string
  let initialProductQuantity: number | undefined
  let clientId: string
  let employeeId: string
  let productId1: string
  let productId2: string
  let orderId: string
  let orderItemId1: string
  let orderItemId2: string

  const companyJokerRepository = setupCompanyJokerRepository()
  const productJokerRepository = setupProductJokerRepository()

  const newCompanyObject = createNewCompanyTestObject({
    CNPJ: '11111111111111',
    email: 'company@test.com',
  })

  const orderItemNotFoundError = new OrderItemNotFoundError()

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

    const createProductResponse1 = await request(app.server)
      .post('/product')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(createNewProductTestObject())

    productId1 = createProductResponse1.body.id

    const createProductResponse2 = await request(app.server)
      .post('/product')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(createNewProductTestObject())

    productId2 = createProductResponse2.body.id

    const newProductJoker = await productJokerRepository.findById(productId1)
    initialProductQuantity = newProductJoker?.quantity

    const orderData = createNewOrderTestObject({
      clientId,
      employeeId,
      orderItems: [
        { productId: productId1, quantity: 2 },
        { productId: productId2, quantity: 3 },
      ],
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

    const orderItems = listOrderItemsResponse.body.orderItems
    orderItemId1 = orderItems[0].id
    orderItemId2 = orderItems[1].id
  })

  afterAll(async () => {
    await app.close()
  })

  it('should not allow deleting OrderItems that do not exist', async () => {
    const invalidOrderItemIds = [uuidv4(), uuidv4()]

    const response = await request(app.server)
      .post('/order-item/delete-many')
      .set('Authorization', `Bearer ${companyToken}`)
      .send({ ids: invalidOrderItemIds })

    expect(response.body).toEqual({
      message: orderItemNotFoundError.message,
      name: orderItemNotFoundError.name,
    })
    expect(response.statusCode).toEqual(404)
  })

  it('should delete multiple OrderItems and adjust product quantities accordingly', async () => {
    const response = await request(app.server)
      .post('/order-item/delete-many')
      .set('Authorization', `Bearer ${companyToken}`)
      .send({ ids: [orderItemId1, orderItemId2] })

    expect(response.body).toEqual({
      count: 2,
    })
    expect(response.statusCode).toEqual(200)

    const updatedProduct1 = await productJokerRepository.findById(productId1)
    const updatedProduct2 = await productJokerRepository.findById(productId2)

    expect(updatedProduct1?.quantity).toEqual(initialProductQuantity)
    expect(updatedProduct2?.quantity).toEqual(initialProductQuantity)
  })
})
