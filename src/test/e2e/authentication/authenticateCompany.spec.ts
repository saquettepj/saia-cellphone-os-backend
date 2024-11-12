import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { translate } from '@/i18n/translate'
import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { MiddlewareError } from '@/errors/middlewareError'

describe('Authentication - (e2e)', () => {
  const invalidTokenMiddlewareError = new MiddlewareError({
    message: translate(TranslationKeysEnum.ERROR_INVALID_TOKEN),
    statusCode: 401,
  })

  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('It should not be able to confirm email without authentication', async () => {
    const sendCompanyEmailResponse = await request(app.server)
      .patch('/email/confirm')
      .send({ emailConfirmationCode: null })

    expect(sendCompanyEmailResponse.statusCode).toEqual(401)
    expect(sendCompanyEmailResponse.body).toEqual({
      message: translate(TranslationKeysEnum.ERROR_TOKEN_MISSING),
    })
  })

  it('It should not be able to confirm email with wrong token', async () => {
    const sendCompanyEmailResponse = await request(app.server)
      .patch('/email/confirm')
      .set('Authorization', `Bearer ${1}`)
      .send({ emailConfirmationCode: null })

    expect(sendCompanyEmailResponse.statusCode).toEqual(
      invalidTokenMiddlewareError.statusCode,
    )
    expect(sendCompanyEmailResponse.body).toEqual({
      message: invalidTokenMiddlewareError.message,
    })
  })
})
