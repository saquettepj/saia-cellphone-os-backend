import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

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

describe('Get Service - (e2e)', () => {
  let companyToken: string
  let clientId: string
  let employeeId: string
  let productId: string
  let secondProductId: string
  let orderId: string
  let orderItemId: string
  let serviceId: string

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

  it('should be able to list the created service with the expected attributes', async () => {
    const response = await request(app.server)
      .post('/service/list')
      .set('Authorization', `Bearer ${companyToken}`)
      .send({ employeeId })

    expect(response.body).toEqual({
      services: [
        {
          id: serviceId,
          orderItemId,
          employeeId,
          status: ServiceStatusEnum.PENDING,
          report: null,
        },
      ],
    })
    expect(response.statusCode).toEqual(200)
  })
})
