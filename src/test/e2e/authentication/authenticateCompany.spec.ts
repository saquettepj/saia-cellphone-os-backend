import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'

describe('Authentication - (e2e)', () => {
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
    expect(sendCompanyEmailResponse.body).toContain({
      message: 'Token missing!',
    })
  })

  it('It should not be able to confirm email with wrong token', async () => {
    const sendCompanyEmailResponse = await request(app.server)
      .patch('/email/confirm')
      .set('Authorization', `Bearer ${1}`)
      .send({ emailConfirmationCode: null })

    expect(sendCompanyEmailResponse.statusCode).toEqual(401)
    expect(sendCompanyEmailResponse.body).toContain({
      message: 'Invalid token!',
    })
  })
})
