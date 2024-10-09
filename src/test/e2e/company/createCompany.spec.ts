import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createNewCompanyTestObject } from '@/test/testObjects/testObjects'

describe('Create company - (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('It should be able to create a company', async () => {
    const newCompanyObject = createNewCompanyTestObject()

    const createCompanyResponse = await request(app.server)
      .post('/company')
      .send(newCompanyObject)

    expect(createCompanyResponse.statusCode).toEqual(201)
    expect(createCompanyResponse.body).toEqual({
      CNPJ: newCompanyObject.CNPJ,
      email: newCompanyObject.email,
      emailChecked: false,
      name: newCompanyObject.name,
      CEP: newCompanyObject.CEP,
      companyImageUrl: null,
    })
  })
})
