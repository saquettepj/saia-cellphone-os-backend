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
import { DeletingError } from '@/errors/deletingError'

describe('Delete access token - (e2e)', () => {
  let adminToken: string
  let normalCompanyToken: string
  let accessTokenId: string

  const authenticateMiddlewareError = new MiddlewareError({
    message: 'Request not allowed!',
    statusCode: 401,
  })

  const deletingError = new DeletingError()

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

    await request(app.server)
      .post('/company')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(normalCompanyObject)

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

  it('should not allow deletion of an access token without being authenticated as admin', async () => {
    const response = await request(app.server)
      .delete(`/access-token/${accessTokenId}`)
      .set('Authorization', `Bearer ${normalCompanyToken}`)

    expect(response.body.message).toEqual(authenticateMiddlewareError.message)
    expect(response.statusCode).toEqual(authenticateMiddlewareError.statusCode)
  })

  it('should not allow deletion of a non-existing access token', async () => {
    const nonExistingTokenId = uuidv4()

    const response = await request(app.server)
      .delete(`/access-token/${nonExistingTokenId}`)
      .set('Authorization', `Bearer ${adminToken}`)

    expect(response.body.message).toEqual(deletingError.message)
    expect(response.statusCode).toEqual(400)
  })

  it('should allow deletion of an existing access token and receive expected return', async () => {
    const response = await request(app.server)
      .delete(`/access-token/${accessTokenId}`)
      .set('Authorization', `Bearer ${adminToken}`)

    expect(response.statusCode).toEqual(204)
  })
})
