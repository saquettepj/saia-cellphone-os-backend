import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import {
  createNewCompanyTestObject,
  createNewEmployeeTestObject,
} from '@/test/testObjects/testObjects'
import { setupCompanyJokerRepository } from '@/test/utils/jokerRepository'
import { CPFAlreadyExistsError } from '@/errors/CPFAlreadyExistsError'
import { MiddlewareError } from '@/errors/middlewareError'
import { translate } from '@/i18n/translate'
import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { RoleEnum } from '@/enums/all.enum'

describe('Update Employee - (e2e)', () => {
  let companyToken: string
  let secondCompanyToken: string
  let employeeId: string

  const companyJokerRepository = setupCompanyJokerRepository()

  const cpfAlreadyExistsError = new CPFAlreadyExistsError()
  const notAllowedError = new MiddlewareError({
    statusCode: 401,
    message: translate(TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED),
    name: TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED,
  })

  const newCompanyObject = createNewCompanyTestObject({
    CNPJ: '11111111111111',
    email: 'company@test.com',
  })

  const secondCompanyObject = createNewCompanyTestObject({
    CNPJ: '22222222222222',
    email: 'secondcompany@test.com',
  })

  const newEmployeeObject = createNewEmployeeTestObject({
    name: 'John Doe',
    CPF: '12345678901',
    phone: '1234567890',
    role: RoleEnum.TECHNICIAN,
  })

  const secondEmployeeObject = createNewEmployeeTestObject({
    name: 'Jane Doe',
    CPF: '09876543210',
    phone: '0987654321',
    role: RoleEnum.TECHNICIAN,
  })

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

    const createEmployeeResponse = await request(app.server)
      .post('/employee')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(newEmployeeObject)

    employeeId = createEmployeeResponse.body.id

    await request(app.server)
      .post('/employee')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(secondEmployeeObject)

    await request(app.server).post('/company').send(secondCompanyObject)

    const authenticateSecondCompanyResponse = await request(app.server)
      .post('/company/authenticate')
      .send({
        CNPJ: secondCompanyObject.CNPJ,
        password: secondCompanyObject.password,
      })

    secondCompanyToken = authenticateSecondCompanyResponse.body.token
  })

  afterAll(async () => {
    await app.close()
  })

  it('should not be able to update an employee to an already existing CPF', async () => {
    const updateEmployeeObject = createNewEmployeeTestObject({
      name: 'Updated Employee',
      CPF: secondEmployeeObject.CPF,
      phone: '1111111111',
      role: RoleEnum.TECHNICIAN,
    })

    const response = await request(app.server)
      .patch(`/employee/${employeeId}`)
      .set('Authorization', `Bearer ${companyToken}`)
      .send(updateEmployeeObject)

    expect(response.body).toEqual({
      message: cpfAlreadyExistsError.message,
      name: cpfAlreadyExistsError.name,
    })
    expect(response.statusCode).toEqual(409)
  })

  it('should not allow one company to update an employee from another company', async () => {
    const response = await request(app.server)
      .patch(`/employee/${employeeId}`)
      .set('Authorization', `Bearer ${secondCompanyToken}`)

    expect(response.body).toEqual({
      message: notAllowedError.message,
      name: notAllowedError.name,
    })
    expect(response.statusCode).toEqual(notAllowedError.statusCode)
  })

  it('should be able to update an employee and return the correct structure', async () => {
    const updateEmployeeObject = createNewEmployeeTestObject({
      name: 'Updated Employee',
      CPF: '98765432109',
      phone: '1111111111',
      role: RoleEnum.TECHNICIAN,
    })

    const response = await request(app.server)
      .patch(`/employee/${employeeId}`)
      .set('Authorization', `Bearer ${companyToken}`)
      .send(updateEmployeeObject)

    expect(response.body).toEqual({
      id: employeeId,
      name: updateEmployeeObject.name,
      CPF: updateEmployeeObject.CPF,
      phone: updateEmployeeObject.phone,
      role: updateEmployeeObject.role,
      companyId: expect.any(String),
    })

    expect(response.statusCode).toEqual(200)
  })
})
