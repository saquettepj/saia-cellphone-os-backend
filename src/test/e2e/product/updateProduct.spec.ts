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

describe('Update product - (e2e)', () => {
  let companyToken: string
  let productId: string
  let secondProductId: string

  const companyJokerRepository = setupCompanyJokerRepository()

  const authenticateCompanyMiddlewareError = new MiddlewareError({
    message: 'Token missing!',
    statusCode: 401,
  })

  const productCheckerByCompanyMiddleware1 = new MiddlewareError({
    statusCode: 401,
    message: 'Request not allowed!',
  })

  const productCheckerByCompanyMiddleware2 = new MiddlewareError({
    statusCode: 404,
    message: 'Product not found!',
  })

  const productDescriptionAlreadyExistsError =
    new ProductDescriptionAlreadyExistsError()

  const newCompanyObject = createNewCompanyTestObject({
    CNPJ: '11111111111111',
    email: 'test@company.com',
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

    const createProductResponse1 = await request(app.server)
      .post('/product')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(newProductObject)

    productId = createProductResponse1.body.id

    const createProductResponse2 = await request(app.server)
      .post('/product')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(createNewProductTestObject())

    secondProductId = createProductResponse2.body.id
  })

  afterAll(async () => {
    await app.close()
  })

  it('should not allow updating a product to an existing description', async () => {
    const updateProductObject = {
      description: newProductObject.description,
    }

    const response = await request(app.server)
      .patch(`/product/${secondProductId}`)
      .set('Authorization', `Bearer ${companyToken}`)
      .send(updateProductObject)

    expect(response.body.message).toEqual(
      productDescriptionAlreadyExistsError.message,
    )
    expect(response.statusCode).toEqual(400)
  })
})
