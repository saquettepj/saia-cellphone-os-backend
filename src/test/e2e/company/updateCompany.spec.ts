import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createNewCompanyTestObject } from '@/test/testObjects/testObjects'
import { setupCompanyJokerRepository } from '@/test/utils/jokerRepository'
import { EmailAlreadyExistsError } from '@/errors/emailAlreadyExistsError'

describe('Update company - (e2e)', () => {
  let validToken: string
  const emailAlreadyExistsError = new EmailAlreadyExistsError()

  const companyJokerRepository = setupCompanyJokerRepository()

  const companyObject = createNewCompanyTestObject({
    CNPJ: '11111111111111',
    email: 'update@company.com',
  })

  const anotherCompanyObject = createNewCompanyTestObject({
    CNPJ: '22222222222222',
    email: 'existing@company.com',
  })

  beforeAll(async () => {
    await app.ready()

    await request(app.server).post('/company').send(companyObject)

    const authenticateResponse = await request(app.server)
      .post('/company/authenticate')
      .send({
        CNPJ: companyObject.CNPJ,
        password: companyObject.password,
      })

    validToken = authenticateResponse.body.token

    const company = await companyJokerRepository.findByCNPJ(companyObject.CNPJ)

    await request(app.server)
      .patch('/email/confirm')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        emailConfirmationCode: company?.emailConfirmationCode,
      })

    await request(app.server).post('/company').send(anotherCompanyObject)
  })

  afterAll(async () => {
    await app.close()
  })

  it('should not allow updating the company email if the email already exists', async () => {
    const updateData = {
      email: anotherCompanyObject.email,
      name: 'Another Company Name',
    }

    const response = await request(app.server)
      .patch('/company')
      .set('Authorization', `Bearer ${validToken}`)
      .send(updateData)

    expect(response.body).toEqual({
      message: emailAlreadyExistsError.message,
      name: emailAlreadyExistsError.name,
    })
    expect(response.statusCode).toEqual(409)
  })

  it('should be able to update the company email and name', async () => {
    const updateData = {
      email: 'newemail@company.com',
      name: 'Updated Company Name',
    }

    const response = await request(app.server)
      .patch('/company')
      .set('Authorization', `Bearer ${validToken}`)
      .send(updateData)

    expect(response.body).toEqual({
      email: updateData.email,
      name: updateData.name,
    })
    expect(response.statusCode).toEqual(200)
  })
})
