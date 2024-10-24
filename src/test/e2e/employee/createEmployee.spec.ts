import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import {
  createNewCompanyTestObject,
  createNewEmployeeTestObject,
} from '@/test/testObjects/testObjects'
import { setupCompanyJokerRepository } from '@/test/utils/jokerRepository'
import { CPFAlreadyExistsError } from '@/errors/CPFAlreadyExistsError'

describe('Create Employee - (e2e)', () => {
  let companyToken: string

  const companyJokerRepository = setupCompanyJokerRepository()

  const cpfAlreadyExistsError = new CPFAlreadyExistsError()

  const newCompanyObject = createNewCompanyTestObject({
    CNPJ: '11111111111111',
    email: 'company@test.com',
  })

  const newEmployeeObject = createNewEmployeeTestObject()

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

  it('should be able to create an employee and return the correct structure', async () => {
    const response = await request(app.server)
      .post('/employee')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(newEmployeeObject)

    expect(response.body).toEqual({
      id: expect.any(String),
      name: newEmployeeObject.name,
      CPF: newEmployeeObject.CPF,
      phone: newEmployeeObject.phone,
      role: newEmployeeObject.role,
      companyId: expect.any(String),
    })

    expect(response.statusCode).toEqual(201)
  })

  it('should not be able to create an employee with an already existing CPF', async () => {
    await request(app.server)
      .post('/employee')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(newEmployeeObject)

    const response = await request(app.server)
      .post('/employee')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(newEmployeeObject)

    expect(response.body.message).toEqual(cpfAlreadyExistsError.message)
    expect(response.statusCode).toEqual(409)
  })
})
