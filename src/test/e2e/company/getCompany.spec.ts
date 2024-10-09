import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createNewCompanyTestObject } from '@/test/testObjects/testObjects'
import { getCompanyEmailConfirmationCode } from '@/test/utils/getCompanyEmailConfirmationCode'

describe('Create product - (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('It should be able list companies', async () => {
    const newCompanyObject = createNewCompanyTestObject({
      CNPJ: '11111111111112',
      email: 'teste@email2.com',
    })

    const createCompanyReturn = await request(app.server)
      .post('/company')
      .send(newCompanyObject)

    const authenticateCompanyResponse = await request(app.server)
      .post('/company/authenticate')
      .send({
        CNPJ: '12323123000000',
        password: 'pass',
      })

    const newCompanyToken = authenticateCompanyResponse.body.token

    const companyEmailConfirmationCode = await getCompanyEmailConfirmationCode(
      createCompanyReturn.body.id,
    )

    await request(app.server)
      .patch(`/email/confirm`)
      .set('Authorization', `Bearer ${newCompanyToken}`)
      .send({
        emailConfirmationCode: companyEmailConfirmationCode,
      })

    const getCompanyResponse = await request(app.server)
      .get(`/company`)
      .set('Authorization', `Bearer ${newCompanyToken}`)
      .send()

    expect(getCompanyResponse.statusCode).toEqual(200)
  })

  it('It should not be able list companies without confirm company email', async () => {
    const newCompanyObject = createNewCompanyTestObject()

    await request(app.server).post('/company').send(newCompanyObject)

    const authenticateCompanyResponse = await request(app.server)
      .post('/company/authenticate')
      .send({
        CNPJ: newCompanyObject.CNPJ,
        password: newCompanyObject.password,
      })

    const newCompanyToken = authenticateCompanyResponse.body.token

    const getCompanyResponse = await request(app.server)
      .get(`/company`)
      .set('Authorization', `Bearer ${newCompanyToken}`)
      .send()

    expect(getCompanyResponse.statusCode).toEqual(401)
    expect(getCompanyResponse.body).toContain({
      message: 'Prerequisite for this action: email confirmation.',
    })
  })
})
