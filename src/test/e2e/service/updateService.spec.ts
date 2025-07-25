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
import {
  setupCompanyJokerRepository,
  setupOrderJokerRepository,
} from '@/test/utils/jokerRepository'
import { OrderStatusEnum, ServiceStatusEnum } from '@/enums/all.enum'
import { OrderItemNotFoundError } from '@/errors/orderItemNotFoundError'
import { EmployeeNotFoundError } from '@/errors/employeeNotFoundError'

describe.skip('Update Service - (e2e)', () => {
  let companyToken: string
  let clientId: string
  let employeeId: string
  let productId: string
  let secondProductId: string
  let orderId: string
  let orderItemId: string
  let serviceId: string

  const orderItemNotFoundError = new OrderItemNotFoundError()
  const employeeNotFoundError = new EmployeeNotFoundError()

  const orderJokerRepository = setupOrderJokerRepository()
  const companyJokerRepository = setupCompanyJokerRepository()

  const newCompanyObject = createNewCompanyTestObject({
    CNPJ: '11111111111111',
    email: 'company@test.com',
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
      .send(createNewProductTestObject({ description: 'second' }))

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

    const serviceData = createNewServiceTestObject({
      orderItemId,
      employeeId,
    })

    const createServiceResponse = await request(app.server)
      .post('/service')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(serviceData)

    serviceId = createServiceResponse.body.id
  })

  afterAll(async () => {
    await app.close()
  })

  it('should not update a service with a non-existent order item', async () => {
    const invalidOrderItemId = uuidv4()
    const updateData = {
      orderItemId: invalidOrderItemId,
      employeeId,
      status: ServiceStatusEnum.COMPLETED,
      report: 'Updated report',
    }

    const response = await request(app.server)
      .patch(`/service/${serviceId}`)
      .set('Authorization', `Bearer ${companyToken}`)
      .send(updateData)

    expect(response.body).toEqual({
      message: orderItemNotFoundError.message,
      name: orderItemNotFoundError.name,
    })
    expect(response.statusCode).toEqual(404)
  })

  it('should not update a service with a non-existent employee ID', async () => {
    const invalidEmployeeId = uuidv4()
    const updateData = {
      orderItemId,
      employeeId: invalidEmployeeId,
      status: ServiceStatusEnum.COMPLETED,
      report: 'Updated report',
    }

    const response = await request(app.server)
      .patch(`/service/${serviceId}`)
      .set('Authorization', `Bearer ${companyToken}`)
      .send(updateData)

    expect(response.body).toEqual({
      message: employeeNotFoundError.message,
      name: employeeNotFoundError.name,
    })
    expect(response.statusCode).toEqual(404)
  })

  it('should update a service and return the expected result', async () => {
    const updateData = {
      orderItemId,
      employeeId,
      status: ServiceStatusEnum.COMPLETED,
      report: 'Updated report',
    }

    const response = await request(app.server)
      .patch(`/service/${serviceId}`)
      .set('Authorization', `Bearer ${companyToken}`)
      .send(updateData)

    const updatedOrder = await orderJokerRepository.findById(orderId)

    expect(response.body).toEqual({
      id: serviceId,
      orderItemId,
      employeeId,
      status: ServiceStatusEnum.COMPLETED,
      report: 'Updated report',
    })
    expect(response.statusCode).toEqual(200)

    expect(updatedOrder?.status).toEqual(OrderStatusEnum.COMPLETED)
  })
})
