import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createNewCompanyTestObject } from '@/test/testObjects/testObjects'

describe('Update Company Terms - (e2e)', () => {
  let companyAccessToken: string

  const validCompanyObject = createNewCompanyTestObject({
    CNPJ: '44444444444444',
    email: 'test@company.com',
  })

  const validTermsUpdate = {
    termsDate: '2023-12-31T00:00:00.000Z',
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

  it('should successfully update the terms date for the company', async () => {
    const response = await request(app.server)
      .patch(`/company/update-terms`)
      .set('Authorization', `Bearer ${companyAccessToken}`)
      .send(validTermsUpdate)

    expect(response.statusCode).toEqual(200)
  })
})
