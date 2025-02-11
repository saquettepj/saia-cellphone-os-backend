import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'

describe('Get System Config - (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return the system configuration', async () => {
    const response = await request(app.server).get('/system-config')

    expect(response.body).toEqual({
      terms: expect.any(String),
      termsUpdateAt: expect.any(String),
      subscriptionAgreement: expect.any(String),
      updatedAt: expect.any(String),
    })
    expect(response.statusCode).toEqual(200)
  })
})
