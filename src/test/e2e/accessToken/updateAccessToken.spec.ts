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
import { AccessTokenNotFoundError } from '@/errors/accessTokenNotFoundError'
import { CompanyNotFoundError } from '@/errors/companyNotFoundError'
import { AnAccessTokenAlreadyHasCompanyIdError } from '@/errors/anAccessTokenAlreadyHasCompanyIdError'
import { ThisAccessTokenAlreadyHasCompanyIdError } from '@/errors/thisAccessTokenAlreadyHasCompanyIdError'
import { translate } from '@/i18n/translate'
import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'

describe('Update access token - (e2e)', () => {
  let adminToken: string
  let normalCompanyToken: string
  let normalCompanyId: string
  let accessTokenId: string

  const authenticateMiddlewareError = new MiddlewareError({
    message: translate(TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED),
    name: TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED,
    statusCode: 401,
  })

  const accessTokenNotFoundError = new AccessTokenNotFoundError()
  const companyNotFoundError = new CompanyNotFoundError()
  const anAccessTokenAlreadyHasCompanyIdError =
    new AnAccessTokenAlreadyHasCompanyIdError()
  const thisAccessTokenAlreadyHasCompanyIdError =
    new ThisAccessTokenAlreadyHasCompanyIdError()

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

    const createAccessTokenResponse = await request(app.server)
      .post('/access-token')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(createNewAccessTokenTestObject())

    accessTokenId = createAccessTokenResponse.body.code
  })

  afterAll(async () => {
    await app.close()
  })

  it('should not allow updating an access token without being authenticated as admin', async () => {
    const response = await request(app.server)
      .patch(`/access-token/${accessTokenId}`)
      .set('Authorization', `Bearer ${normalCompanyToken}`)
      .send({ companyId: normalCompanyId })

    expect(response.body).toEqual({
      message: authenticateMiddlewareError.message,
      name: authenticateMiddlewareError.name,
    })
    expect(response.statusCode).toEqual(authenticateMiddlewareError.statusCode)
  })

  it('should not allow updating a non-existing access token', async () => {
    const nonExistingTokenId = uuidv4()

    const response = await request(app.server)
      .patch(`/access-token/${nonExistingTokenId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ companyId: normalCompanyId })

    expect(response.body).toEqual({
      message: accessTokenNotFoundError.message,
      name: accessTokenNotFoundError.name,
    })
    expect(response.statusCode).toEqual(404)
  })

  it('should not allow updating an access token to a companyId that already has a token', async () => {
    await request(app.server)
      .post('/access-token')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(createNewAccessTokenTestObject({ companyId: normalCompanyId }))

    const response = await request(app.server)
      .patch(`/access-token/${accessTokenId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ companyId: normalCompanyId })

    expect(response.body).toEqual({
      message: anAccessTokenAlreadyHasCompanyIdError.message,
      name: anAccessTokenAlreadyHasCompanyIdError.name,
    })
    expect(response.statusCode).toEqual(400)
  })

  it('should not allow updating an access token to a non-existing companyId', async () => {
    const nonExistingCompanyId = uuidv4()

    const response = await request(app.server)
      .patch(`/access-token/${accessTokenId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ companyId: nonExistingCompanyId })

    expect(response.body).toEqual({
      message: companyNotFoundError.message,
      name: companyNotFoundError.name,
    })
    expect(response.statusCode).toEqual(404)
  })

  it('should allow updating an access token with a valid companyId', async () => {
    const newCompanyObject = createNewCompanyTestObject({
      CNPJ: '44444444444444',
      email: 'newcompany@company.com',
    })

    const createNewCompanyResponse = await request(app.server)
      .post('/company')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newCompanyObject)

    const newCompanyId = createNewCompanyResponse.body.id

    const response = await request(app.server)
      .patch(`/access-token/${accessTokenId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ companyId: newCompanyId })

    expect(response.statusCode).toEqual(204)
  })

  it('should not allow updating an access token if the token already has the provided companyId', async () => {
    const response = await request(app.server)
      .patch(`/access-token/${accessTokenId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ companyId: normalCompanyId })

    expect(response.body).toEqual({
      message: thisAccessTokenAlreadyHasCompanyIdError.message,
      name: thisAccessTokenAlreadyHasCompanyIdError.name,
    })
    expect(response.statusCode).toEqual(400)
  })
})
