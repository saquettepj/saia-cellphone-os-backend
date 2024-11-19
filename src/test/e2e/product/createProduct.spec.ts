import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { v4 as uuidv4 } from 'uuid'

import { app } from '@/app'
import {
  createNewCompanyTestObject,
  createNewProductTestObject,
} from '@/test/testObjects/testObjects'
import { setupCompanyJokerRepository } from '@/test/utils/jokerRepository'
import { MiddlewareError } from '@/errors/middlewareError'
import { ProductDescriptionAlreadyExistsError } from '@/errors/productDescriptionAlreadyExistsError'
import { formatUniqueStrings } from '@/utils/formatUniqueStrings'
import { translate } from '@/i18n/translate'
import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { SupplierNotFoundError } from '@/errors/supplierNotFoundError'

describe('Create product - (e2e)', () => {
  let validToken: string

  const companyJokerRepository = setupCompanyJokerRepository()

  const productDescriptionAlreadyExistsError =
    new ProductDescriptionAlreadyExistsError()
  const supplierNotFoundError = new SupplierNotFoundError()

  const emailConfirmationMiddlewareError = new MiddlewareError({
    message: translate(
      TranslationKeysEnum.ERROR_PREREQUISITE_EMAIL_CONFIRMATION,
    ),
    statusCode: 401,
  })

  const invalidTokenMiddlewareError = new MiddlewareError({
    message: translate(TranslationKeysEnum.ERROR_INVALID_TOKEN),
    statusCode: 401,
  })

  beforeAll(async () => {
    await app.ready()

    const newCompanyObject = createNewCompanyTestObject({
      CNPJ: '11111111111111',
      email: 'valid@company.com',
    })

    await request(app.server).post('/company').send(newCompanyObject)

    const authenticateCompanyResponse = await request(app.server)
      .post('/company/authenticate')
      .send({
        CNPJ: newCompanyObject.CNPJ,
        password: newCompanyObject.password,
      })

    validToken = authenticateCompanyResponse.body.token

    const company = await companyJokerRepository.findByCNPJ(
      newCompanyObject.CNPJ,
    )

    await request(app.server)
      .patch(`/email/confirm`)
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        emailConfirmationCode: company?.emailConfirmationCode,
      })
  })

  afterAll(async () => {
    await app.close()
  })

  it('should not allow creating a product with a non-existent supplierId', async () => {
    const newProductObject = createNewProductTestObject({
      supplierId: uuidv4(),
    })

    const response = await request(app.server)
      .post('/product')
      .set('Authorization', `Bearer ${validToken}`)
      .send(newProductObject)

    expect(response.body.message).toEqual(supplierNotFoundError.message)
    expect(response.statusCode).toEqual(404)
  })

  it('should be able to create a product with all attributes', async () => {
    const newProductObject = createNewProductTestObject()

    const response = await request(app.server)
      .post('/product')
      .set('Authorization', `Bearer ${validToken}`)
      .send(newProductObject)

    expect(response.body).toEqual({
      id: expect.any(String),
      companyId: expect.any(String),
      type: newProductObject.type,
      condition: newProductObject.condition,
      description: formatUniqueStrings(newProductObject.description),
      price: newProductObject.price,
      cost: newProductObject.cost,
      quantity: newProductObject.quantity,
      localization: newProductObject.localization,
      supplierId: null,
    })
    expect(response.statusCode).toEqual(201)
  })

  it('should not allow product creation without email confirmation', async () => {
    const newProductObject = createNewProductTestObject()

    const unconfirmedCompanyObject = createNewCompanyTestObject({
      CNPJ: '33333333333333',
      email: 'unconfirmed@company.com',
    })

    await request(app.server).post('/company').send(unconfirmedCompanyObject)

    const unconfirmedAuthResponse = await request(app.server)
      .post('/company/authenticate')
      .send({
        CNPJ: unconfirmedCompanyObject.CNPJ,
        password: unconfirmedCompanyObject.password,
      })

    const unconfirmedToken = unconfirmedAuthResponse.body.token

    const response = await request(app.server)
      .post('/product')
      .set('Authorization', `Bearer ${unconfirmedToken}`)
      .send(newProductObject)

    expect(response.body.message).toEqual(
      emailConfirmationMiddlewareError.message,
    )
    expect(response.statusCode).toEqual(
      emailConfirmationMiddlewareError.statusCode,
    )
  })

  it('should not allow product creation with an invalid authentication token', async () => {
    const newProductObject = createNewProductTestObject()

    const response = await request(app.server)
      .post('/product')
      .set('Authorization', `Bearer invalidToken`)
      .send(newProductObject)

    expect(response.body.message).toEqual(invalidTokenMiddlewareError.message)
    expect(response.statusCode).toEqual(invalidTokenMiddlewareError.statusCode)
  })

  it('should not allow creation of a product with an existing description for the same company', async () => {
    const duplicateProductObject = createNewProductTestObject()
    duplicateProductObject.description = 'Unique Product Description'

    await request(app.server)
      .post('/product')
      .set('Authorization', `Bearer ${validToken}`)
      .send(duplicateProductObject)

    const response = await request(app.server)
      .post('/product')
      .set('Authorization', `Bearer ${validToken}`)
      .send(duplicateProductObject)

    expect(response.body.message).toEqual(
      productDescriptionAlreadyExistsError.message,
    )
    expect(response.statusCode).toEqual(400)
  })
})
