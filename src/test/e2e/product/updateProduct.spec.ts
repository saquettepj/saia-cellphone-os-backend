import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { v4 as uuidv4 } from 'uuid'

import { app } from '@/app'
import {
  createNewCompanyTestObject,
  createNewProductTestObject,
} from '@/test/testObjects/testObjects'
import { setupCompanyJokerRepository } from '@/test/utils/jokerRepository'
import { ProductDescriptionAlreadyExistsError } from '@/errors/productDescriptionAlreadyExistsError'
import { SupplierNotFoundError } from '@/errors/supplierNotFoundError'

describe('Update product - (e2e)', () => {
  let companyToken: string
  let secondProductId: string

  const companyJokerRepository = setupCompanyJokerRepository()

  const productDescriptionAlreadyExistsError =
    new ProductDescriptionAlreadyExistsError()
  const supplierNotFoundError = new SupplierNotFoundError()

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

    await request(app.server)
      .post('/product')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(newProductObject)

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

    expect(response.body).toEqual({
      message: productDescriptionAlreadyExistsError.message,
      name: productDescriptionAlreadyExistsError.name,
    })
    expect(response.statusCode).toEqual(400)
  })

  it('should not allow updating a product to a non-existent supplierId', async () => {
    const updateProductObject = {
      supplierId: uuidv4(),
    }

    const response = await request(app.server)
      .patch(`/product/${secondProductId}`)
      .set('Authorization', `Bearer ${companyToken}`)
      .send(updateProductObject)

    expect(response.body).toEqual({
      message: supplierNotFoundError.message,
      name: supplierNotFoundError.name,
    })
    expect(response.statusCode).toEqual(404)
  })
})
