import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { env } from '@/env'
import { app } from '@/app'
import {
  createNewAccessTokenTestObject,
  createNewCompanyTestObject,
} from '@/test/testObjects/testObjects'
import { MiddlewareError } from '@/errors/middlewareError'
import { translate } from '@/i18n/translate'
import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'

describe('Get access tokens - (e2e)', () => {
  let adminToken: string
  let normalCompanyToken: string

  const authenticateMiddlewareError = new MiddlewareError({
    message: translate(TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED),
    name: TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED,
    statusCode: 401,
  })

  const normalCompanyObject = createNewCompanyTestObject({
    CNPJ: '33333333333333',
    email: 'normal@company.com',
  })

  const testAccessTokenObject = createNewAccessTokenTestObject()

  beforeAll(async () => {
    await app.ready()

    const adminAuthResponse = await request(app.server)
      .post('/company/authenticate')
      .send({
        CNPJ: env.ADMIN_ACCOUNT_CNPJ,
        password: env.ADMIN_ACCOUNT_PASSWORD,
      })

    adminToken = adminAuthResponse.body.token

    await request(app.server).post('/company').send(normalCompanyObject)

    const normalAuthResponse = await request(app.server)
      .post('/company/authenticate')
      .send({
        CNPJ: normalCompanyObject.CNPJ,
        password: normalCompanyObject.password,
      })

    normalCompanyToken = normalAuthResponse.body.token

    await request(app.server)
      .post('/access-token')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(testAccessTokenObject)
  })

  afterAll(async () => {
    await app.close()
  })

  it('should allow an admin to list all access tokens', async () => {
    const response = await request(app.server)
      .get('/access-token')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(response.body.accessTokens).toBeInstanceOf(Array)
    expect(response.body.accessTokens[0]).toEqual(
      expect.objectContaining({
        code: expect.any(String),
        companyId: null,
        activatedAt: null,
      }),
    )
    expect(response.statusCode).toEqual(200)
  })

  it('should not allow a normal company to list access tokens', async () => {
    const response = await request(app.server)
      .get('/access-token')
      .set('Authorization', `Bearer ${normalCompanyToken}`)

    expect(response.body).toEqual({
      message: authenticateMiddlewareError.message,
      name: authenticateMiddlewareError.name,
    })
    expect(response.statusCode).toEqual(authenticateMiddlewareError.statusCode)
  })
})
