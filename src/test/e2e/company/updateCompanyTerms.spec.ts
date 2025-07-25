import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createNewCompanyTestObject } from '@/test/testObjects/testObjects'

describe('Update Company Terms - (e2e)', () => {
  let companyAccessToken: string

  const validCompanyObject = createNewCompanyTestObject({
    CNPJ: '55555555555555',
    email: 'test@company.com',
  })

  const validCompanyTermsUpdate = {
    companyTerms: 'These are the new company terms.',
  }

  beforeAll(async () => {
    await app.ready()

    await request(app.server).post('/company').send(validCompanyObject)

    const authResponse = await request(app.server)
      .post('/company/authenticate')
      .send({
        CNPJ: validCompanyObject.CNPJ,
        password: validCompanyObject.password,
      })

    companyAccessToken = authResponse.body.token
  })

  afterAll(async () => {
    await app.close()
  })

  it('should successfully update the company terms', async () => {
    const response = await request(app.server)
      .patch(`/company/update-terms`)
      .set('Authorization', `Bearer ${companyAccessToken}`)
      .send(validCompanyTermsUpdate)

    expect(response.statusCode).toEqual(200)
  })
})
