import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createNewCompanyTestObject } from '@/test/testObjects/testObjects'

describe('Update Company Lists - (e2e)', () => {
  let companyAccessToken: string

  const validCompanyObject = createNewCompanyTestObject({
    CNPJ: '44444444444444',
    email: 'test@company.com',
  })

  const updatedObjectValidLists = {
    lists: ['name, field1, field 2, field 4'],
  }

  beforeAll(async () => {
    await app.ready()

    await request(app.server).post('/company').send(validCompanyObject)

    const authResponse = await request(app.server)
      .post('/company/authenticate')
      .send({
        CNPJ: validCompanyObject.CNPJ,
        password: validCompanyObject.password,
      })

    companyAccessToken = authResponse.body.token
  })

  afterAll(async () => {
    await app.close()
  })

  it('should successfully update a list for the company', async () => {
    const response = await request(app.server)
      .patch(`/company/update-lists`)
      .set('Authorization', `Bearer ${companyAccessToken}`)
      .send(updatedObjectValidLists)

    expect(response.body).toEqual(
      expect.objectContaining({
        lists: updatedObjectValidLists.lists,
      }),
    )
    expect(response.statusCode).toEqual(200)
  })
})
