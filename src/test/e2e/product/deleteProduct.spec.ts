import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import {
  createNewCompanyTestObject,
  createNewProductTestObject,
} from '@/test/testObjects/testObjects'
import { getCompanyEmailConfirmationCode } from '@/test/utils/getCompanyEmailConfirmationCode'

describe('Delete product - (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('It should be able to delete a product', async () => {
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

    const newProductId = createProductResponse.body.id

    const deleteProductResponse = await request(app.server)
      .delete(`/product/${newProductId}`)
      .set('Authorization', `Bearer ${newCompanyToken}`)
      .send()

    expect(deleteProductResponse.statusCode).toEqual(200)
  })

  it('It should not be able to delete a product if the requester is not the owner', async () => {
    const newCompanyObject = createNewCompanyTestObject()
    const newProductObject = createNewProductTestObject()

    const newCompanyObject2 = createNewCompanyTestObject({
      CNPJ: '11111111111112',
      email: 'teste@email2.com',
    })

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

    const newProductId = createProductResponse.body.id

    const createCompanyResponse2 = await request(app.server)
      .post('/company')
      .send(newCompanyObject2)

    const authenticateCompanyResponse2 = await request(app.server)
      .post('/company/authenticate')
      .send({
        CNPJ: newCompanyObject2.CNPJ,
        password: newCompanyObject2.password,
      })

    const newCompanyId2 = createCompanyResponse2.body.id
    const newCompanyToken2 = authenticateCompanyResponse2.body.token

    const companyEmailConfirmationCode2 =
      await getCompanyEmailConfirmationCode(newCompanyId2)

    await request(app.server)
      .patch(`/email/confirm`)
      .set('Authorization', `Bearer ${newCompanyToken2}`)
      .send({
        emailConfirmationCode: companyEmailConfirmationCode2,
      })

    const deleteProductResponse = await request(app.server)
      .delete(`/product/${newProductId}`)
      .set('Authorization', `Bearer ${newCompanyToken2}`)
      .send()

    expect(deleteProductResponse.statusCode).toEqual(401)
    expect(deleteProductResponse.body).toEqual({
      message: 'Request not allowed!',
    })
  })
})
