import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import {
  createNewCompanyTestObject,
  createNewProductTestObject,
} from '@/test/testObjects/testObjects'
import { setupCompanyJokerRepository } from '@/test/utils/jokerRepository'
import { MiddlewareError } from '@/errors/middlewareError'
import { translate } from '@/i18n/translate'
import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'

describe('Delete product - (e2e)', () => {
  let companyToken: string
  let companyToken2: string
  let productId: string

  const companyJokerRepository = setupCompanyJokerRepository()

  const newCompanyObject = createNewCompanyTestObject()
  const newProductObject = createNewProductTestObject()

  const productCheckerByCompanyMiddlewareError = new MiddlewareError({
    statusCode: 401,
    message: translate(TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED),
    name: TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED,
  })

  const newCompanyObject2 = createNewCompanyTestObject({
    CNPJ: '11111111111112',
    email: 'teste@email2.com',
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

    const createProductResponse = await request(app.server)
      .post('/product')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(newProductObject)

    productId = createProductResponse.body.id

    await request(app.server).post('/company').send(newCompanyObject2)

    const authenticateCompanyResponse2 = await request(app.server)
      .post('/company/authenticate')
      .send({
        CNPJ: newCompanyObject2.CNPJ,
        password: newCompanyObject2.password,
      })

    companyToken2 = authenticateCompanyResponse2.body.token

    const newCompanyJoker2 = await companyJokerRepository.findByCNPJ(
      newCompanyObject2.CNPJ,
    )

    await request(app.server)
      .patch('/email/confirm')
      .set('Authorization', `Bearer ${companyToken2}`)
      .send({
        emailConfirmationCode: newCompanyJoker2?.emailConfirmationCode,
      })
  })

  afterAll(async () => {
    await app.close()
  })

  it('should not be able to delete a product if the requester is not the owner', async () => {
    const response = await request(app.server)
      .delete(`/product/${productId}`)
      .set('Authorization', `Bearer ${companyToken2}`)
      .send()

    expect(response.body).toEqual({
      message: productCheckerByCompanyMiddlewareError.message,
      name: productCheckerByCompanyMiddlewareError.name,
    })
    expect(response.statusCode).toEqual(
      productCheckerByCompanyMiddlewareError.statusCode,
    )
  })

  it('should be able to delete a product', async () => {
    const response = await request(app.server)
      .delete(`/product/${productId}`)
      .set('Authorization', `Bearer ${companyToken}`)
      .send()

    expect(response.body).toEqual({
      id: productId,
    })
    expect(response.statusCode).toEqual(200)
  })
})
