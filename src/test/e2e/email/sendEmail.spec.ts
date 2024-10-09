import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createNewCompanyTestObject } from '@/test/testObjects/testObjects'

describe('Send email - (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('It should be able to send confirmation email to company email', async () => {
    const newCompanyObject = createNewCompanyTestObject()

    const createCompanyResponse = await request(app.server)
      .post('/company')
      .send(newCompanyObject)

    expect(createCompanyResponse.statusCode).toEqual(201)
  })
})
