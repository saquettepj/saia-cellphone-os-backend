import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createNewCompanyTestObject } from '@/test/testObjects/testObjects'

describe('Update Company Text Message - (e2e)', () => {
  let companyAccessToken: string

  const validCompanyObject = createNewCompanyTestObject({
    CNPJ: '55555555555555',
    email: 'test@company.com',
  })

  const validTextMessageUpdate = {
    textMessage: 'This is a new text message.',
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

  it('should successfully update the text message for the company', async () => {
    const response = await request(app.server)
      .patch(`/company/update-text-message`)
      .set('Authorization', `Bearer ${companyAccessToken}`)
      .send(validTextMessageUpdate)

    expect(response.statusCode).toEqual(200)
  })
})
