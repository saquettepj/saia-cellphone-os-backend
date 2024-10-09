import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import {
  createNewCompanyTestObject,
  createNewProductTestObject,
} from '@/test/testObjects/testObjects'
import { getCompanyEmailConfirmationCode } from '@/test/utils/getCompanyEmailConfirmationCode'

describe('Create product - (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('It should be able create a product', async () => {
    const newCompanyObject = createNewCompanyTestObject()
    const newProductObject = createNewProductTestObject()

    const createCompanyResponse = await request(app.server)
      .post('/company')
      .send(newCompanyObject)

    const authenticateCompanyResponse = await request(app.server)
      .post('/company/authenticate')
      .send({
        CNPJ: newCompanyObject.CNPJ,
        password: newCompanyObject.password,
      })

    const newCompanyId = createCompanyResponse.body.id
    const newCompanyToken = authenticateCompanyResponse.body.token

    const companyEmailConfirmationCode =
      await getCompanyEmailConfirmationCode(newCompanyId)

    await request(app.server)
      .patch(`/email/confirm`)
      .set('Authorization', `Bearer ${newCompanyToken}`)
      .send({
        emailConfirmationCode: companyEmailConfirmationCode,
      })

    const createProductResponse = await request(app.server)
      .post(`/product`)
      .set('Authorization', `Bearer ${newCompanyToken}`)
      .send(newProductObject)

    expect(createProductResponse.statusCode).toEqual(201)
  })
})
