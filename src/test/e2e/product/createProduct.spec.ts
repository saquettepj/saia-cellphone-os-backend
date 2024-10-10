import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import {
  createNewCompanyTestObject,
  createNewProductTestObject,
} from '@/test/testObjects/testObjects'
import { setupCompanyJokerRepository } from '@/test/utils/jokerRepository'
import { getCompanyIdByToken } from '@/test/utils/getCompanyIdByToken'

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
    const companyJokerRepository = setupCompanyJokerRepository()

    await request(app.server).post('/company').send(newCompanyObject)

    const authenticateCompanyResponse = await request(app.server)
      .post('/company/authenticate')
      .send({
        CNPJ: newCompanyObject.CNPJ,
        password: newCompanyObject.password,
      })

    const newCompanyToken = authenticateCompanyResponse.body.token
    const newCompanyId = getCompanyIdByToken(newCompanyToken)

    const newCompanyJoker = await companyJokerRepository.findByCNPJ(
      newCompanyObject.CNPJ,
    )

    await request(app.server)
      .patch(`/email/confirm`)
      .set('Authorization', `Bearer ${newCompanyToken}`)
      .send({
        emailConfirmationCode: newCompanyJoker?.emailConfirmationCode,
      })

    const createProductResponse = await request(app.server)
      .post(`/product`)
      .set('Authorization', `Bearer ${newCompanyToken}`)
      .send(newProductObject)

    expect(createProductResponse.statusCode).toEqual(201)
    expect(createProductResponse.body).toEqual({
      id: createProductResponse.body.id,
      companyId: newCompanyId,
      manufactureBy: newProductObject.manufactureBy,
      model: newProductObject.model,
      condition: newProductObject.condition,
      description: newProductObject.description,
    })
  })
})
