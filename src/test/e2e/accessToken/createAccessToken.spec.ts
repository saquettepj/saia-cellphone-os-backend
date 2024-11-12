import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { v4 as uuidv4 } from 'uuid'

import { env } from '@/env'
import { app } from '@/app'
import {
  createNewAccessTokenTestObject,
  createNewCompanyTestObject,
} from '@/test/testObjects/testObjects'
import { MiddlewareError } from '@/errors/middlewareError'
import { AnAccessTokenAlreadyHasCompanyIdError } from '@/errors/anAccessTokenAlreadyHasCompanyIdError'
import { translate } from '@/i18n/translate'
import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'

describe('Create access token - (e2e)', () => {
  let adminToken: string
  let normalCompanyToken: string
  let normalCompanyId: string

  const companyNotFoundError = new MiddlewareError({
    message: translate(TranslationKeysEnum.ERROR_COMPANY_NOT_FOUND),
    statusCode: 404,
  })

  const authenticateMiddlewareError = new MiddlewareError({
    message: translate(TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED),
    statusCode: 401,
  })

  const accessTokenAlreadyHasCompanyIdError =
    new AnAccessTokenAlreadyHasCompanyIdError()

  const normalCompanyObject = createNewCompanyTestObject({
    CNPJ: '33333333333333',
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

    adminToken = adminAuthResponse.body.token

    const createNormalCompany = await request(app.server)
      .post('/company')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(normalCompanyObject)

    normalCompanyId = createNormalCompany.body.id

    const normalAuthResponse = await request(app.server)
      .post('/company/authenticate')
      .send({
        CNPJ: normalCompanyObject.CNPJ,
        password: normalCompanyObject.password,
      })

    normalCompanyToken = normalAuthResponse.body.token
  })

  afterAll(async () => {
    await app.close()
  })

  it('should not allow creation of an access token without being authenticated as admin', async () => {
    const response = await request(app.server)
      .post('/access-token')
      .set('Authorization', `Bearer ${normalCompanyToken}`)

    expect(response.body.message).toEqual(authenticateMiddlewareError.message)
    expect(response.statusCode).toEqual(authenticateMiddlewareError.statusCode)
  })

  it('should not allow creation of an access token with a non-existing companyId', async () => {
    const nonExistingCompanyId = uuidv4()

    const response = await request(app.server)
      .post('/access-token')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ companyId: nonExistingCompanyId })

    expect(response.body.message).toEqual(companyNotFoundError.message)
    expect(response.statusCode).toEqual(companyNotFoundError.statusCode)
  })

  it('should allow creation of an access token with a valid companyId', async () => {
    const testAccessTokenObject = createNewAccessTokenTestObject({
      companyId: normalCompanyId,
    })

    const response = await request(app.server)
      .post('/access-token')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(testAccessTokenObject)

    expect(response.body).toEqual(
      expect.objectContaining({
        code: expect.any(String),
        companyId: normalCompanyId,
        activatedAt: expect.any(String),
      }),
    )
    expect(response.statusCode).toEqual(201)
  })

  it('should allow creation of an access token without specifying companyId', async () => {
    const testAccessTokenObjectWithOutId = createNewAccessTokenTestObject()

    const response = await request(app.server)
      .post('/access-token')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(testAccessTokenObjectWithOutId)

    expect(response.body).toEqual(
      expect.objectContaining({
        code: expect.any(String),
        companyId: null,
        activatedAt: null,
      }),
    )
    expect(response.statusCode).toEqual(201)
  })

  it('should not allow creation of an access token with a companyId that is already associated with another access token', async () => {
    const testAccessTokenObject = createNewAccessTokenTestObject({
      companyId: normalCompanyId,
    })

    await request(app.server)
      .post('/access-token')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(testAccessTokenObject)

    const response = await request(app.server)
      .post('/access-token')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(testAccessTokenObject)

    expect(response.body.message).toEqual(
      accessTokenAlreadyHasCompanyIdError.message,
    )
    expect(response.statusCode).toEqual(400)
  })
})
