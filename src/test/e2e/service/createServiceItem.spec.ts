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
  createNewServiceTestObject,
} from '@/test/testObjects/testObjects'
import { setupCompanyJokerRepository } from '@/test/utils/jokerRepository'
import { ServiceStatusEnum } from '@/enums/all.enum'
import { EmployeeNotFoundError } from '@/errors/employeeNotFoundError'
import { OrderItemNotFoundError } from '@/errors/orderItemNotFoundError'

describe('Create Service - (e2e)', () => {
  let companyToken: string
  let clientId: string
  let employeeId: string
  let productId: string
  let secondProductId: string
  let orderId: string
  let orderItemId: string

  const companyJokerRepository = setupCompanyJokerRepository()

  const newCompanyObject = createNewCompanyTestObject({
    CNPJ: '11111111111111',
    email: 'company@test.com',
  })

  const employeeNotFoundError = new EmployeeNotFoundError()
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

    const orderItemData = createNewOrderItemTestObject({
      orderId,
      productId: secondProductId,
      quantity: 1,
    })

    const createOrderItemResponse = await request(app.server)
      .post('/order-item')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(orderItemData)

    orderItemId = createOrderItemResponse.body.id
  })

  afterAll(async () => {
    await app.close()
  })

  it('should not create a service with a non-existent order item', async () => {
    const invalidOrderItemId = uuidv4()
    const newServiceData = createNewServiceTestObject({
      orderItemId: invalidOrderItemId,
      employeeId,
    })

    const response = await request(app.server)
      .post('/service')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(newServiceData)

    expect(response.body).toEqual({
      message: orderItemNotFoundError.message,
      name: orderItemNotFoundError.name,
    })
    expect(response.statusCode).toEqual(404)
  })

  it('should not create a service with a non-existent employee ID', async () => {
    const invalidEmployeeId = uuidv4()

    const newServiceData = createNewServiceTestObject({
      orderItemId,
      employeeId: invalidEmployeeId,
    })

    const response = await request(app.server)
      .post('/service')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(newServiceData)

    expect(response.body).toEqual({
      message: employeeNotFoundError.message,
      name: employeeNotFoundError.name,
    })
    expect(response.statusCode).toEqual(404)
  })

  it('should create an service with the expected attributes', async () => {
    const newServiceData = createNewServiceTestObject({
      orderItemId,
      employeeId,
    })

    const response = await request(app.server)
      .post('/service')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(newServiceData)

    expect(response.body).toEqual({
      id: expect.any(String),
      orderItemId,
      employeeId,
      report: null,
      status: ServiceStatusEnum.PENDING,
    })
    expect(response.statusCode).toEqual(201)
  })
})
