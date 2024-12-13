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
import { DuplicateOrderItemError } from '@/errors/duplicateOrderItemError'
import { translate } from '@/i18n/translate'
import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'

describe('Create Order - (e2e)', () => {
  let companyToken: string
  let secondCompanyEmployeeId: string
  let clientId: string
  let employeeId: string
  let productId: string

  const companyJokerRepository = setupCompanyJokerRepository()
  const productJokerRepository = setupProductJokerRepository()

  const clientNotFoundMiddlewareError = new MiddlewareError({
    statusCode: 404,
    message: translate(TranslationKeysEnum.ERROR_CLIENT_NOT_FOUND),
    name: TranslationKeysEnum.ERROR_CLIENT_NOT_FOUND,
  })

  const employeeNotFoundMiddlewareError = new MiddlewareError({
    statusCode: 404,
    message: translate(TranslationKeysEnum.ERROR_EMPLOYEE_NOT_FOUND),
    name: TranslationKeysEnum.ERROR_EMPLOYEE_NOT_FOUND,
  })

  const productNotFoundMiddlewareError = new MiddlewareError({
    statusCode: 404,
    message: translate(TranslationKeysEnum.ERROR_PRODUCTS_NOT_FOUND),
    name: TranslationKeysEnum.ERROR_PRODUCTS_NOT_FOUND,
  })

  const employeeNotBelongsToCompanyError = new MiddlewareError({
    statusCode: 401,
    message: translate(TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED),
    name: TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED,
  })

  const duplicateOrderItemError = new DuplicateOrderItemError()

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
  const secondCompanyEmployeeObject = createNewEmployeeTestObject({
    name: 'Second Company Employee',
    CPF: '98765432100',
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

    await request(app.server).post('/company').send(secondCompanyObject)

    const authenticateSecondCompanyResponse = await request(app.server)
      .post('/company/authenticate')
      .send({
        CNPJ: secondCompanyObject.CNPJ,
        password: secondCompanyObject.password,
      })

    const secondCompanyToken = authenticateSecondCompanyResponse.body.token

    const secondCompanyJoker = await companyJokerRepository.findByCNPJ(
      secondCompanyObject.CNPJ,
    )

    await request(app.server)
      .patch('/email/confirm')
      .set('Authorization', `Bearer ${secondCompanyToken}`)
      .send({
        emailConfirmationCode: secondCompanyJoker?.emailConfirmationCode,
      })

    const createSecondCompanyEmployeeResponse = await request(app.server)
      .post('/employee')
      .set('Authorization', `Bearer ${secondCompanyToken}`)
      .send(secondCompanyEmployeeObject)

    secondCompanyEmployeeId = createSecondCompanyEmployeeResponse.body.id
  })

  afterAll(async () => {
    await app.close()
  })

  it('should not allow creating an order with a non-existent client', async () => {
    const orderData = createNewOrderTestObject({
      clientId: uuidv4(),
      employeeId,
      orderItems: [{ productId, quantity: 2 }],
    })

    const response = await request(app.server)
      .post('/order')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(orderData)

    expect(response.body).toEqual({
      message: clientNotFoundMiddlewareError.message,
      name: clientNotFoundMiddlewareError.name,
    })
    expect(response.statusCode).toEqual(
      clientNotFoundMiddlewareError.statusCode,
    )
  })

  it('should not allow creating an order with a non-existent employee', async () => {
    const orderData = createNewOrderTestObject({
      clientId,
      employeeId: uuidv4(),
      orderItems: [{ productId, quantity: 2 }],
    })

    const response = await request(app.server)
      .post('/order')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(orderData)

    expect(response.body).toEqual({
      message: employeeNotFoundMiddlewareError.message,
      name: employeeNotFoundMiddlewareError.name,
    })
    expect(response.statusCode).toEqual(
      employeeNotFoundMiddlewareError.statusCode,
    )
  })

  it('should not allow creating an order with non-existent products', async () => {
    const orderData = createNewOrderTestObject({
      clientId,
      employeeId,
      orderItems: [{ productId: uuidv4(), quantity: 2 }],
    })

    const response = await request(app.server)
      .post('/order')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(orderData)

    expect(response.body).toEqual({
      message: productNotFoundMiddlewareError.message,
      name: productNotFoundMiddlewareError.name,
    })
    expect(response.statusCode).toEqual(
      productNotFoundMiddlewareError.statusCode,
    )
  })

  it('should not allow creating an order if the employee does not belong to the company', async () => {
    const orderData = createNewOrderTestObject({
      clientId,
      employeeId: secondCompanyEmployeeId,
      orderItems: [{ productId, quantity: 2 }],
    })

    const response = await request(app.server)
      .post('/order')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(orderData)

    expect(response.body).toEqual({
      message: employeeNotBelongsToCompanyError.message,
      name: employeeNotBelongsToCompanyError.name,
    })
    expect(response.statusCode).toEqual(
      employeeNotBelongsToCompanyError.statusCode,
    )
  })

  it('should not allow creating an order with duplicate product items', async () => {
    const orderData = createNewOrderTestObject({
      clientId,
      employeeId,
      orderItems: [
        { productId, quantity: 2 },
        { productId, quantity: 1 },
      ],
    })

    const response = await request(app.server)
      .post('/order')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(orderData)

    expect(response.body).toEqual({
      message: duplicateOrderItemError.message,
      name: duplicateOrderItemError.name,
    })
    expect(response.statusCode).toEqual(400)
  })

  it('should create an order and return the correct response structure', async () => {
    const orderData = createNewOrderTestObject({
      clientId,
      employeeId,
      orderItems: [{ productId, quantity: 1 }],
    })

    const orderPrice = Math.max(
      (newProductObject.price - (orderData.orderItems[0].discount || 0)) *
        orderData.orderItems[0].quantity,
      0,
    )

    const response = await request(app.server)
      .post('/order')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(orderData)

    expect(response.body).toEqual({
      number: expect.any(Number),
      id: expect.any(String),
      companyId: expect.any(String),
      clientId,
      employeeId,
      status: orderData.status,
      paymentStatus: orderData.paymentStatus,
      payDate: expect.any(String),
      paymentMethod: orderData.paymentMethod,
      price: orderPrice,
      type: orderData.type,
      description: orderData.description,
      closingDate: null,
      firstDueDate: orderData.firstDueDate || null,
      dueDate: orderData.dueDate || null,
      interest: orderData.interest || null,
      numberOfInstallments: orderData.numberOfInstallments || null,
      createdAt: expect.any(String),
      orderItems: [
        {
          id: expect.any(String),
          discount: orderData.orderItems[0].discount || null,
          productId: orderData.orderItems[0].productId,
          registeredProductPrice: newProductObject.price,
          quantity: orderData.orderItems[0].quantity,
          initialQuantity: newProductObject.quantity,
        },
      ],
    })
    expect(response.statusCode).toEqual(201)

    const updatedProduct = await productJokerRepository.findById(productId)
    const initialProductQuantity = updatedProduct?.quantity

    expect(updatedProduct?.quantity).toEqual(
      Math.max(initialProductQuantity! - orderData.orderItems[0].quantity, 0),
    )
  })
})
