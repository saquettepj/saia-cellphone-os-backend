import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { env } from '@/env'
import { UpdatingError } from '@/errors/updatingError'
import { MiddlewareError } from '@/errors/middlewareError'
import { translate } from '@/i18n/translate'
import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { createNewCompanyTestObject } from '@/test/testObjects/testObjects'

describe('Update System Config - (e2e)', () => {
  let adminAccessToken: string

  const updatingError = new UpdatingError()

  const authenticateMiddlewareError = new MiddlewareError({
    message: translate(TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED),
    name: TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED,
    statusCode: 401,
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
  })

  afterAll(async () => {
    await app.close()
  })

  it('should successfully update the system configuration with the correct password', async () => {
    const updateData = {
      terms: 'Updated terms content.',
      subscriptionAgreement: 'Updated subscriptionAgreement content',
      password: env.ADMIN_UPDATE_PASSWORD,
    }

    const response = await request(app.server)
      .patch('/system-config')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(updateData)

    expect(response.body).toEqual({
      terms: updateData.terms,
      termsUpdateAt: expect.any(String),
      subscriptionAgreement: updateData.subscriptionAgreement,
      updatedAt: expect.any(String),
    })
    expect(response.statusCode).toEqual(200)
  })

  it('should not allow updating the system configuration with an incorrect password', async () => {
    const updateData = {
      terms: 'Updated terms content.',
      password: 'wrong-password',
    }

    const response = await request(app.server)
      .patch('/system-config')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(updateData)

    expect(response.body).toEqual({
      message: updatingError.message,
      name: updatingError.name,
    })
    expect(response.statusCode).toEqual(400)
  })

  it('should not allow a request without admin authorization', async () => {
    const normalCompanyObject = createNewCompanyTestObject({
      CNPJ: '22222222222222',
      email: 'normal@company.com',
    })

    const updateData = {
      terms: 'Updated terms content.',
      password: env.ADMIN_UPDATE_PASSWORD,
    }

    await request(app.server).post('/company').send(normalCompanyObject)

    const normalAuthResponse = await request(app.server)
      .post('/company/authenticate')
      .send({
        CNPJ: normalCompanyObject.CNPJ,
        password: normalCompanyObject.password,
      })

    const normalCompanyToken = normalAuthResponse.body.token

    const response = await request(app.server)
      .patch('/system-config')
      .set('Authorization', `Bearer ${normalCompanyToken}`)
      .send(updateData)

    expect(response.body).toEqual({
      message: authenticateMiddlewareError.message,
      name: authenticateMiddlewareError.name,
    })
    expect(response.statusCode).toEqual(authenticateMiddlewareError.statusCode)
  })

  it('should allow updating the system configuration without terms and subscriptionAgreement', async () => {
    const updateData = {
      password: env.ADMIN_UPDATE_PASSWORD,
    }

    const response = await request(app.server)
      .patch('/system-config')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(updateData)

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      terms: expect.any(String),
      termsUpdateAt: expect.any(String),
      subscriptionAgreement: expect.any(String),
      updatedAt: expect.any(String),
    })
  })
})
