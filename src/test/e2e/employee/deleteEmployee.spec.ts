import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import {
  createNewCompanyTestObject,
  createNewEmployeeTestObject,
} from '@/test/testObjects/testObjects'
import { setupCompanyJokerRepository } from '@/test/utils/jokerRepository'
import { MiddlewareError } from '@/errors/middlewareError'
import { EmployeeNotFoundError } from '@/errors/employeeNotFoundError'
import { translate } from '@/i18n/translate'
import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'

describe('Delete Employee - (e2e)', () => {
  let companyToken: string
  let secondCompanyToken: string
  let employeeId: string

  const companyJokerRepository = setupCompanyJokerRepository()

  const notAllowedError = new MiddlewareError({
    statusCode: 401,
    message: translate(TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED),
  })

  const employeeNotFoundError = new EmployeeNotFoundError()

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
    role: 'Manager',
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

  it('should not allow one company to delete an employee from another company', async () => {
    const response = await request(app.server)
      .delete(`/employee/${employeeId}`)
      .set('Authorization', `Bearer ${secondCompanyToken}`)

    expect(response.body.message).toEqual(notAllowedError.message)
    expect(response.statusCode).toEqual(notAllowedError.statusCode)
  })

  it('should return an error if the employee does not exist', async () => {
    const nonExistentEmployeeId = 'a6f5e7bc-23ad-41a3-aeae-123456789012'

    const response = await request(app.server)
      .delete(`/employee/${nonExistentEmployeeId}`)
      .set('Authorization', `Bearer ${companyToken}`)

    expect(response.body.message).toEqual(employeeNotFoundError.message)
    expect(response.statusCode).toEqual(404)
  })

  it('should be able to delete an employee', async () => {
    const response = await request(app.server)
      .delete(`/employee/${employeeId}`)
      .set('Authorization', `Bearer ${companyToken}`)

    expect(response.statusCode).toEqual(204)
  })
})
