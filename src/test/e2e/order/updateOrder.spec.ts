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
  updateNewOrderTestObject,
} from '@/test/testObjects/testObjects'
import { setupCompanyJokerRepository } from '@/test/utils/jokerRepository'
import { MiddlewareError } from '@/errors/middlewareError'

describe('Update Order - (e2e)', () => {
  let companyToken: string
  let companyId: string | undefined
  let clientId: string
  let employeeId: string
  let productId: string
  let orderId: string
  let secondCompanyToken: string
  let orderData: ReturnType<typeof createNewOrderTestObject>

  const companyJokerRepository = setupCompanyJokerRepository()

  const newCompanyObject = createNewCompanyTestObject({
    CNPJ: '11111111111111',
    email: 'company@test.com',
  })

  const secondCompanyObject = createNewCompanyTestObject({
    CNPJ: '22222222222222',
    email: 'secondcompany@test.com',
  })

  const newClientObject = createNewClientTestObject()
  const newEmployeeObject = createNewEmployeeTestObject()
  const newProductObject = createNewProductTestObject()

  const employeeNotFoundError = new MiddlewareError({
    statusCode: 404,
    message: 'Employee not found!',
  })

  const clientNotFoundError = new MiddlewareError({
    statusCode: 404,
    message: 'Client not found!',
  })

  const requestNotAllowedError = new MiddlewareError({
    statusCode: 401,
    message: 'Request not allowed!',
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

    await request(app.server).post('/company').send(secondCompanyObject)

    const authenticateSecondCompanyResponse = await request(app.server)
      .post('/company/authenticate')
      .send({
        CNPJ: secondCompanyObject.CNPJ,
        password: secondCompanyObject.password,
      })

    secondCompanyToken = authenticateSecondCompanyResponse.body.token

    const secondCompanyJoker = await companyJokerRepository.findByCNPJ(
      secondCompanyObject.CNPJ,
    )

    await request(app.server)
      .patch('/email/confirm')
      .set('Authorization', `Bearer ${secondCompanyToken}`)
      .send({
        emailConfirmationCode: secondCompanyJoker?.emailConfirmationCode,
      })
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return error when updating an order with a non-existent employee', async () => {
    const invalidEmployeeId = uuidv4()

    const response = await request(app.server)
      .patch(`/order/${orderId}`)
      .set('Authorization', `Bearer ${companyToken}`)
      .send({ ...orderData, employeeId: invalidEmployeeId })

    expect(response.body.message).toEqual(employeeNotFoundError.message)
    expect(response.statusCode).toEqual(employeeNotFoundError.statusCode)
  })

  it('should return error when updating an order with a non-existent client', async () => {
    const invalidClientId = uuidv4()

    const response = await request(app.server)
      .patch(`/order/${orderId}`)
      .set('Authorization', `Bearer ${companyToken}`)
      .send({ ...orderData, clientId: invalidClientId })

    expect(response.body.message).toEqual(clientNotFoundError.message)
    expect(response.statusCode).toEqual(clientNotFoundError.statusCode)
  })

  it('should return error when updating an order not belonging to the authenticated company', async () => {
    const response = await request(app.server)
      .patch(`/order/${orderId}`)
      .set('Authorization', `Bearer ${secondCompanyToken}`)
      .send({ status: 'updated status' })

    expect(response.body.message).toEqual(requestNotAllowedError.message)
    expect(response.statusCode).toEqual(requestNotAllowedError.statusCode)
  })

  it('should update an order successfully with the correct response structure', async () => {
    const updatedOrderData = updateNewOrderTestObject({
      clientId,
      employeeId,
      status: 'Updated Status',
      description: 'Updated Description',
    })

    const response = await request(app.server)
      .patch(`/order/${orderId}`)
      .set('Authorization', `Bearer ${companyToken}`)
      .send(updatedOrderData)

    expect(response.body).toEqual({
      id: orderId,
      companyId,
      clientId,
      employeeId,
      number: updatedOrderData.number,
      type: updatedOrderData.type,
      status: updatedOrderData.status,
      payDate: updatedOrderData.payDate,
      paymentMethod: updatedOrderData.paymentMethod,
      price: updatedOrderData.price,
      description: updatedOrderData.description,
    })
    expect(response.statusCode).toEqual(200)
  })
})
