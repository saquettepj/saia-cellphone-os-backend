import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

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

describe('Get Orders - (e2e)', () => {
  let companyToken: string
  let companyId: string | undefined
  let initialQuantity: number | undefined
  let clientId: string
  let employeeId: string
  let productId: string
  let orderId: string
  let orderData: ReturnType<typeof createNewOrderTestObject>

  const companyJokerRepository = setupCompanyJokerRepository()
  const productJokerRepository = setupProductJokerRepository()

  const newCompanyObject = createNewCompanyTestObject({
    CNPJ: '11111111111111',
    email: 'company@test.com',
  })

  const newClientObject = createNewClientTestObject()
  const newEmployeeObject = createNewEmployeeTestObject()
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

    companyId = newCompanyJoker?.id

    await request(app.server)
      .patch('/email/confirm')
      .set('Authorization', `Bearer ${companyToken}`)
      .send({
        emailConfirmationCode: newCompanyJoker?.emailConfirmationCode,
      })

    const createClientResponse = await request(app.server)
      .post('/client')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(newClientObject)

    clientId = createClientResponse.body.id

    const createEmployeeResponse = await request(app.server)
      .post('/employee')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(newEmployeeObject)

    employeeId = createEmployeeResponse.body.id

    const createProductResponse = await request(app.server)
      .post('/product')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(newProductObject)

    productId = createProductResponse.body.id

    const newProductJoker = await productJokerRepository.findById(productId)

    initialQuantity = newProductJoker?.quantity

    orderData = createNewOrderTestObject({
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

  it('should be able to list all orders for a company with the correct response structure', async () => {
    const response = await request(app.server)
      .post('/order/list')
      .set('Authorization', `Bearer ${companyToken}`)
      .send({})

    expect(response.body.orders).toBeInstanceOf(Array)
    expect(response.body.orders.length).toBeGreaterThan(0)
    expect(response.body.orders[0]).toEqual({
      id: orderId,
      companyId,
      clientId,
      employeeId,
      number: orderData.number,
      type: orderData.type,
      status: orderData.status,
      payDate: orderData.payDate,
      paymentMethod: orderData.paymentMethod,
      price: orderData.price,
      description: orderData.description,
      createdAt: expect.any(String),
      orderItems: [
        {
          id: expect.any(String),
          orderId,
          productId,
          quantity: orderData.orderItems[0].quantity,
          initialQuantity,
        },
      ],
    })
    expect(response.statusCode).toEqual(200)
  })
})
