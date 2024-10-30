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
import { setupCompanyJokerRepository } from '@/test/utils/jokerRepository'
import { MiddlewareError } from '@/errors/middlewareError'

describe('Delete Order - (e2e)', () => {
  let companyToken: string
  let secondCompanyToken: string
  let orderId: string
  let clientId: string
  let employeeId: string
  let productId: string

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

  const orderNotFoundError = new MiddlewareError({
    statusCode: 404,
    message: 'Order not found!',
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

    const orderData = createNewOrderTestObject({
      clientId,
      employeeId,
      orderItems: [{ productId, quantity: 1 }],
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

  it('should return an error when deleting a non-existent order', async () => {
    const invalidOrderId = uuidv4()

    const response = await request(app.server)
      .delete(`/order/${invalidOrderId}`)
      .set('Authorization', `Bearer ${companyToken}`)

    expect(response.body.message).toEqual(orderNotFoundError.message)
    expect(response.statusCode).toEqual(orderNotFoundError.statusCode)
  })

  it('should return an error when deleting an order belonging to another company', async () => {
    const response = await request(app.server)
      .delete(`/order/${orderId}`)
      .set('Authorization', `Bearer ${secondCompanyToken}`)

    expect(response.body.message).toEqual(requestNotAllowedError.message)
    expect(response.statusCode).toEqual(requestNotAllowedError.statusCode)
  })

  it('should delete an order successfully and return the correct structure', async () => {
    const response = await request(app.server)
      .delete(`/order/${orderId}`)
      .set('Authorization', `Bearer ${companyToken}`)

    expect(response.body).toEqual({ id: orderId })
    expect(response.statusCode).toEqual(200)
  })
})
