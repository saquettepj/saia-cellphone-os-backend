import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import {
  createNewClientTestObject,
  createNewCompanyTestObject,
} from '@/test/testObjects/testObjects'
import { setupCompanyJokerRepository } from '@/test/utils/jokerRepository'
import { CPFAlreadyExistsError } from '@/errors/CPFAlreadyExistsError'
import { EmailAlreadyExistsError } from '@/errors/emailAlreadyExistsError'

describe('Create Client - (e2e)', () => {
  let companyToken: string

  const companyJokerRepository = setupCompanyJokerRepository()

  const cpfAlreadyExistsError = new CPFAlreadyExistsError()
  const emailAlreadyExistsError = new EmailAlreadyExistsError()

  const newCompanyObject = createNewCompanyTestObject({
    CNPJ: '44444444444444',
    email: 'testcompany@company.com',
  })

  const newClientObject = createNewClientTestObject()

  beforeAll(async () => {
    await app.ready()

    await request(app.server).post('/company').send(newCompanyObject)

    const authenticateCompanyResponse = await request(app.server)
      .post('/company/authenticate')
      .send({
        CNPJ: newCompanyObject.CNPJ,
        password: newCompanyObject.password,
      })

    companyToken = authenticateCompanyResponse.body.token

    const newCompanyJoker = await companyJokerRepository.findByCNPJ(
      newCompanyObject.CNPJ,
    )

    await request(app.server)
      .patch('/email/confirm')
      .set('Authorization', `Bearer ${companyToken}`)
      .send({
        emailConfirmationCode: newCompanyJoker?.emailConfirmationCode,
      })
  })

  afterAll(async () => {
    await app.close()
  })

  it('should not be able to create a client with an already used CPF', async () => {
    await request(app.server)
      .post('/client')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(newClientObject)

    const response = await request(app.server)
      .post('/client')
      .set('Authorization', `Bearer ${companyToken}`)
      .send({ ...newClientObject, email: 'newemail@test.com' })

    expect(response.body).toEqual({
      message: cpfAlreadyExistsError.message,
      name: cpfAlreadyExistsError.name,
    })
    expect(response.statusCode).toEqual(409)
  })

  it('should not be able to create a client with an already used email', async () => {
    await request(app.server)
      .post('/client')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(newClientObject)

    const response = await request(app.server)
      .post('/client')
      .set('Authorization', `Bearer ${companyToken}`)
      .send({ ...newClientObject, CPF: '98765432109' })

    expect(response.body).toEqual({
      message: emailAlreadyExistsError.message,
      name: emailAlreadyExistsError.name,
    })
    expect(response.statusCode).toEqual(409)
  })

  it('should be able to create a client and return the correct response structure', async () => {
    const clientObject = {
      name: 'New Client',
      CPF: '98765432109',
      email: 'newclient@test.com',
      phone: '0987654321',
    }

    const response = await request(app.server)
      .post('/client')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(clientObject)

    expect(response.body).toEqual({
      id: expect.any(String),
      companyId: expect.any(String),
      name: clientObject.name,
      CPF: clientObject.CPF,
      email: clientObject.email,
      phone: clientObject.phone,
      address: null,
    })
    expect(response.statusCode).toEqual(201)
  })
})
