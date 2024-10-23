import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { env } from '@/env'
import { app } from '@/app'
import { createNewCompanyTestObject } from '@/test/testObjects/testObjects'
import { MiddlewareError } from '@/errors/middlewareError'

describe('Get company list - (e2e)', () => {
  let adminAccessToken: string
  let normalCompanyAccessToken: string

  const authenticateMiddlewareError = new MiddlewareError({
    message: 'Request not allowed!',
    statusCode: 401,
  })

  const normalCompanyObject = createNewCompanyTestObject({
    CNPJ: '22222222222222',
    email: 'normal@company.com',
  })

  beforeAll(async () => {
    await app.ready()

    const adminAuthResponse = await request(app.server)
      .post('/company/authenticate')
      .send({
        CNPJ: env.ADMIN_ACCOUNT_CNPJ,
        password: env.ADMIN_ACCOUNT_PASSWORD,
      })

    adminAccessToken = adminAuthResponse.body.token

    await request(app.server).post('/company').send(normalCompanyObject)

    const normalAuthResponse = await request(app.server)
      .post('/company/authenticate')
      .send({
        CNPJ: normalCompanyObject.CNPJ,
        password: normalCompanyObject.password,
      })

    normalCompanyAccessToken = normalAuthResponse.body.token
  })

  afterAll(async () => {
    await app.close()
  })

  it('should allow an admin to list all companies', async () => {
    const response = await request(app.server)
      .get('/company')
      .set('Authorization', `Bearer ${adminAccessToken}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.companies).toBeInstanceOf(Array)
    expect(response.body.companies.length).toEqual(1)
  })

  it('should not allow a normal company to list all companies', async () => {
    const response = await request(app.server)
      .get('/company')
      .set('Authorization', `Bearer ${normalCompanyAccessToken}`)

    expect(response.statusCode).toEqual(authenticateMiddlewareError.statusCode)
    expect(response.body.message).toEqual(authenticateMiddlewareError.message)
  })
})
