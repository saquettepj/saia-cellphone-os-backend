import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import {
  createNewCompanyTestObject,
  createNewEmployeeTestObject,
} from '@/test/testObjects/testObjects'
import { setupCompanyJokerRepository } from '@/test/utils/jokerRepository'
import { RoleEnum } from '@/enums/all.enum'

describe.skip('Get Employees - (e2e)', () => {
  let companyToken: string
  let employeeId: string

  const companyJokerRepository = setupCompanyJokerRepository()

  const newCompanyObject = createNewCompanyTestObject({
    CNPJ: '11111111111111',
    email: 'company@test.com',
  })

  const newEmployeeObject = createNewEmployeeTestObject({
    name: 'John Doe',
    CPF: '12345678901',
    phone: '1234567890',
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
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list employees and return the correct structure', async () => {
    const response = await request(app.server)
      .post('/employee/list')
      .set('Authorization', `Bearer ${companyToken}`)
      .send({})

    expect(response.body.employees).toBeInstanceOf(Array)
    expect(response.body.employees.length).toBeGreaterThan(0)

    const employee = response.body.employees[0]

    expect(employee).toEqual(
      expect.objectContaining({
        id: employeeId,
        name: newEmployeeObject.name,
        CPF: newEmployeeObject.CPF,
        phone: newEmployeeObject.phone,
        role: newEmployeeObject.role,
        companyId: expect.any(String),
        orders: expect.any(Array),
      }),
    )

    expect(response.statusCode).toEqual(200)
  })
})
