import request from 'supertest'
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest'
import { v4 as uuidv4 } from 'uuid'

import { env } from '@/env'
import { app } from '@/app'
import { createNewCompanyTestObject } from '@/test/testObjects/testObjects'
import { DeletingError } from '@/errors/deletingError'
import { MiddlewareError } from '@/errors/middlewareError'
import { translate } from '@/i18n/translate'
import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'

describe('Delete company - (e2e)', () => {
  let adminToken: string
  let normalCompanyToken: string
  let companyId: string
  const deletingError = new DeletingError()

  const normalCompanyObject = createNewCompanyTestObject({
    CNPJ: '22222222222222',
    email: 'normal@company.com',
  })

  const companyDeleteMiddlewareError = new MiddlewareError({
    statusCode: 401,
    message: translate(TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED),
    name: TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED,
  })

  beforeAll(async () => {
    await app.ready()

    const adminAuthResponse = await request(app.server)
      .post('/company/authenticate')
      .send({
        CNPJ: env.ADMIN_ACCOUNT_CNPJ,
        password: env.ADMIN_ACCOUNT_PASSWORD,
      })

    adminToken = adminAuthResponse.body.token
  })

  beforeEach(async () => {
    await request(app.server).post('/company').send(normalCompanyObject)

    const normalAuthResponse = await request(app.server)
      .post('/company/authenticate')
      .send({
        CNPJ: normalCompanyObject.CNPJ,
        password: normalCompanyObject.password,
      })

    normalCompanyToken = normalAuthResponse.body.token

    const getCompanyResponse = await request(app.server)
      .get('/company')
      .set('Authorization', `Bearer ${adminToken}`)

    companyId = getCompanyResponse.body.companies[0].id
  })

  afterEach(async () => {
    await request(app.server)
      .delete(`/company/${companyId}`)
      .set('Authorization', `Bearer ${adminToken}`)
  })

  afterAll(async () => {
    await app.close()
  })

  it('should not allow an admin to delete a company with wrong password', async () => {
    const response = await request(app.server)
      .delete(`/company/${companyId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ password: 'wrong-password' })

    expect(response.body).toEqual({
      message: deletingError.message,
      name: deletingError.name,
    })
    expect(response.statusCode).toEqual(400)
  })

  it('should allow an admin to delete a company', async () => {
    const response = await request(app.server)
      .delete(`/company/${companyId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ password: env.ADMIN_DELETE_PASSWORD })

    expect(response.statusCode).toEqual(204)
  })

  it('should not allow a normal company to delete another company', async () => {
    const response = await request(app.server)
      .delete(`/company/${companyId}`)
      .set('Authorization', `Bearer ${normalCompanyToken}`)
      .send({ password: env.ADMIN_DELETE_PASSWORD })

    expect(response.body).toEqual({
      message: companyDeleteMiddlewareError.message,
      name: companyDeleteMiddlewareError.name,
    })
    expect(response.statusCode).toEqual(companyDeleteMiddlewareError.statusCode)
  })

  it('should not allow deletion of a non-existent company', async () => {
    const nonExistentCompanyId = uuidv4()

    const response = await request(app.server)
      .delete(`/company/${nonExistentCompanyId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ password: env.ADMIN_DELETE_PASSWORD })

    expect(response.body).toEqual({
      message: deletingError.message,
      name: deletingError.name,
    })
    expect(response.statusCode).toEqual(400)
  })
})
