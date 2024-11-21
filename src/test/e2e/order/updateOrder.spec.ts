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
import { translate } from '@/i18n/translate'
import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import {
  OrderStatusEnum,
  OrderTypeEnum,
  PaymentMethodEnum,
} from '@/enums/all.enum'

describe('Update Order - (e2e)', () => {
  let companyToken: string
  let companyId: string | undefined
  let clientId: string
  let employeeId: string
  let productId: string
  let orderId: string
  let secondCompanyToken: string
  let secondClientId: string
  let secondEmployeeId: string
  let secondProductId: string
  let secondOrderId: string
  let orderData: ReturnType<typeof createNewOrderTestObject>
  let updateOrderData: ReturnType<typeof updateNewOrderTestObject>

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
    message: translate(TranslationKeysEnum.ERROR_EMPLOYEE_NOT_FOUND),
    name: TranslationKeysEnum.ERROR_EMPLOYEE_NOT_FOUND,
  })

  const clientNotFoundError = new MiddlewareError({
    statusCode: 404,
    message: translate(TranslationKeysEnum.ERROR_CLIENT_NOT_FOUND),
    name: TranslationKeysEnum.ERROR_CLIENT_NOT_FOUND,
  })

  const requestNotAllowedError = new MiddlewareError({
    statusCode: 401,
    message: translate(TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED),
    name: TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED,
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

    orderData = createNewOrderTestObject({
      clientId,
      employeeId,
      orderItems: [{ productId, quantity: 2 }],
    })

    updateOrderData = updateNewOrderTestObject({
      type: OrderTypeEnum.SERVICE,
      status: OrderStatusEnum.CANCELED,
      paymentMethod: PaymentMethodEnum.ESTIMATE,
      price: 150.75,
      description: 'desc',
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

    const secondCreateClientResponse = await request(app.server)
      .post('/client')
      .set('Authorization', `Bearer ${secondCompanyToken}`)
      .send(newClientObject)

    secondClientId = secondCreateClientResponse.body.id

    const secondCreateEmployeeResponse = await request(app.server)
      .post('/employee')
      .set('Authorization', `Bearer ${secondCompanyToken}`)
      .send(newEmployeeObject)

    secondEmployeeId = secondCreateEmployeeResponse.body.id

    const secondCreateProductResponse = await request(app.server)
      .post('/product')
      .set('Authorization', `Bearer ${secondCompanyToken}`)
      .send(newProductObject)

    secondProductId = secondCreateProductResponse.body.id

    const secondOrderData = createNewOrderTestObject({
      clientId: secondClientId,
      employeeId: secondEmployeeId,
      orderItems: [{ productId: secondProductId, quantity: 2 }],
    })

    const secondCreateOrderResponse = await request(app.server)
      .post('/order')
      .set('Authorization', `Bearer ${secondCompanyToken}`)
      .send(secondOrderData)

    secondOrderId = secondCreateOrderResponse.body.id
  })

  afterAll(async () => {
    await app.close()
  })

  it('should not allow an authenticated company to update an order belonging to another company', async () => {
    const response = await request(app.server)
      .patch(`/order/${secondOrderId}`)
      .set('Authorization', `Bearer ${companyToken}`)
      .send({
        status: OrderStatusEnum.CANCELED,
        description: 'invalid update',
      })

    expect(response.body).toEqual({
      message: requestNotAllowedError.message,
      name: requestNotAllowedError.name,
    })
    expect(response.statusCode).toEqual(requestNotAllowedError.statusCode)
  })

  it('should return error when updating an order with a non-existent employee', async () => {
    const invalidEmployeeId = uuidv4()

    const response = await request(app.server)
      .patch(`/order/${orderId}`)
      .set('Authorization', `Bearer ${companyToken}`)
      .send({
        ...updateOrderData,
        clientId: undefined,
        employeeId: invalidEmployeeId,
      })

    expect(response.body).toEqual({
      message: employeeNotFoundError.message,
      name: employeeNotFoundError.name,
    })
    expect(response.statusCode).toEqual(employeeNotFoundError.statusCode)
  })

  it('should return error when updating an order with a non-existent client', async () => {
    const invalidClientId = uuidv4()

    const response = await request(app.server)
      .patch(`/order/${orderId}`)
      .set('Authorization', `Bearer ${companyToken}`)
      .send({ ...updateOrderData, clientId: invalidClientId })

    expect(response.body).toEqual({
      message: clientNotFoundError.message,
      name: clientNotFoundError.name,
    })
    expect(response.statusCode).toEqual(clientNotFoundError.statusCode)
  })

  it('should return error when updating an order not belonging to the authenticated company', async () => {
    const response = await request(app.server)
      .patch(`/order/${orderId}`)
      .set('Authorization', `Bearer ${secondCompanyToken}`)
      .send({ status: 'updated status' })

    expect(response.body).toEqual({
      message: requestNotAllowedError.message,
      name: requestNotAllowedError.name,
    })
    expect(response.statusCode).toEqual(requestNotAllowedError.statusCode)
  })

  it('should update an order successfully with the correct response structure', async () => {
    const updatedOrderData = updateNewOrderTestObject({
      ...updateOrderData,
      clientId,
      employeeId,
      companyId,
    })

    const response = await request(app.server)
      .patch(`/order/${orderId}`)
      .set('Authorization', `Bearer ${companyToken}`)
      .send(updatedOrderData)

    expect(response.body).toEqual({
      companyId,
      number: expect.any(Number),
      id: orderId,
      clientId,
      employeeId,
      type: updatedOrderData.type,
      status: updatedOrderData.status,
      paymentStatus: updateOrderData.paymentStatus,
      payDate: updatedOrderData.payDate,
      paymentMethod: updatedOrderData.paymentMethod,
      price: updatedOrderData.price,
      description: updatedOrderData.description,
      closingDate: null,
      firstDueDate: orderData.firstDueDate || null,
      dueDate: orderData.dueDate || null,
      interest: orderData.interest || null,
      numberOfInstallments: orderData.numberOfInstallments || null,
    })
    expect(response.statusCode).toEqual(200)
  })
})
