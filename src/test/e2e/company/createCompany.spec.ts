import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createNewCompanyTestObject } from '@/test/testObjects/testObjects'
import { EmailAlreadyExistsError } from '@/errors/emailAlreadyExistsError'
import { CompanyCNPJAlreadyExistsError } from '@/errors/companyCNPJAlreadyExistsError'

describe('Create company - (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  const emailAlreadyExistsError = new EmailAlreadyExistsError()
  const companyCNPJAlreadyExistsError = new CompanyCNPJAlreadyExistsError()

  const newCompanyObject = createNewCompanyTestObject({
    CNPJ: '11111111111112',
    email: 'test@company.com',
  })

  const existingCompanyObject = createNewCompanyTestObject({
    CNPJ: '12345678901234',
    email: 'existing@company.com',
  })

  it('should create a company with all attributes', async () => {
    const response = await request(app.server)
      .post('/company')
      .send(newCompanyObject)

    expect(response.body).toEqual({
      id: expect.any(String),
      CNPJ: newCompanyObject.CNPJ,
      email: newCompanyObject.email,
      name: newCompanyObject.name,
      emailChecked: false,
    })
    expect(response.statusCode).toEqual(201)
  })

  it('should not allow company creation with an existing CNPJ', async () => {
    await request(app.server).post('/company').send(existingCompanyObject)

    const response = await request(app.server).post('/company').send({
      CNPJ: existingCompanyObject.CNPJ,
      email: 'new@company.com',
      name: 'New Company',
      password: 'ValidPass1!',
      passwordConfirmation: 'ValidPass1!',
    })

    expect(response.body).toEqual({
      message: companyCNPJAlreadyExistsError.message,
      name: companyCNPJAlreadyExistsError.name,
    })
    expect(response.statusCode).toEqual(409)
  })

  it('should not allow company creation with an existing email', async () => {
    const response = await request(app.server).post('/company').send({
      CNPJ: '33333333333333',
      email: existingCompanyObject.email,
      name: 'Another Company',
      password: 'ValidPass1!',
      passwordConfirmation: 'ValidPass1!',
    })

    expect(response.body).toEqual({
      message: emailAlreadyExistsError.message,
      name: emailAlreadyExistsError.name,
    })
    expect(response.statusCode).toEqual(409)
  })
})
