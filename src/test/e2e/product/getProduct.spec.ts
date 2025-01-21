import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import {
  createNewCompanyTestObject,
  createNewProductTestObject,
} from '@/test/testObjects/testObjects'
import { setupCompanyJokerRepository } from '@/test/utils/jokerRepository'
import { MiddlewareError } from '@/errors/middlewareError'
import { formatUniqueStrings } from '@/utils/formatUniqueStrings'
import { translate } from '@/i18n/translate'
import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'

describe.skip('Get product - (e2e)', () => {
  let companyToken: string
  let unconfirmedToken: string
  let productId: string

  const companyJokerRepository = setupCompanyJokerRepository()

  const emailConfirmationMiddlewareError = new MiddlewareError({
    message: translate(
      TranslationKeysEnum.ERROR_PREREQUISITE_EMAIL_CONFIRMATION,
    ),
    name: TranslationKeysEnum.ERROR_PREREQUISITE_EMAIL_CONFIRMATION,
    statusCode: 401,
  })

  const authenticateCompanyMiddlewareError = new MiddlewareError({
    message: translate(TranslationKeysEnum.ERROR_TOKEN_MISSING),
    name: TranslationKeysEnum.ERROR_TOKEN_MISSING,
    statusCode: 401,
  })

  const newCompanyObject = createNewCompanyTestObject({
    CNPJ: '11111111111111',
    email: 'test@company.com',
  })

  const unconfirmedCompanyObject = createNewCompanyTestObject({
    CNPJ: '22222222222222',
    email: 'unconfirmed@company.com',
  })

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

    await request(app.server)
      .patch('/email/confirm')
      .set('Authorization', `Bearer ${companyToken}`)
      .send({
        emailConfirmationCode: newCompanyJoker?.emailConfirmationCode,
      })

    const createProductResponse = await request(app.server)
      .post('/product')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(newProductObject)

    productId = createProductResponse.body.id

    await request(app.server).post('/company').send(unconfirmedCompanyObject)

    const unconfirmedAuthResponse = await request(app.server)
      .post('/company/authenticate')
      .send({
        CNPJ: unconfirmedCompanyObject.CNPJ,
        password: unconfirmedCompanyObject.password,
      })

    unconfirmedToken = unconfirmedAuthResponse.body.token
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list products from authenticated company', async () => {
    const response = await request(app.server)
      .post('/product/list')
      .set('Authorization', `Bearer ${companyToken}`)
      .send({})

    expect(response.body.products).toBeInstanceOf(Array)
    expect(response.body.products.length).toBeGreaterThan(0)
    expect(response.body.products[0]).toEqual(
      expect.objectContaining({
        id: productId,
        companyId: expect.any(String),
        type: newProductObject.type,
        condition: newProductObject.condition,
        description: formatUniqueStrings(newProductObject.description),
        price: newProductObject.price,
        cost: newProductObject.cost,
        quantity: newProductObject.quantity,
        warrantyDays: null,
        localization: newProductObject.localization,
        supplierId: null,
      }),
    )
    expect(response.statusCode).toEqual(200)
  })

  it('should not allow listing products without authentication', async () => {
    const response = await request(app.server).post('/product/list').send({})

    expect(response.body).toEqual({
      message: authenticateCompanyMiddlewareError.message,
      name: authenticateCompanyMiddlewareError.name,
    })
    expect(response.statusCode).toEqual(
      authenticateCompanyMiddlewareError.statusCode,
    )
  })

  it('should not allow listing products without email confirmation', async () => {
    const response = await request(app.server)
      .post('/product/list')
      .set('Authorization', `Bearer ${unconfirmedToken}`)
      .send({})

    expect(response.body).toEqual({
      message: emailConfirmationMiddlewareError.message,
      name: emailConfirmationMiddlewareError.name,
    })
    expect(response.statusCode).toEqual(
      emailConfirmationMiddlewareError.statusCode,
    )
  })
})
