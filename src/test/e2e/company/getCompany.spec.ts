import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { env } from '@/env'
import { app } from '@/app'
import { createNewCompanyTestObject } from '@/test/testObjects/testObjects'
import { MiddlewareError } from '@/errors/middlewareError'
import { translate } from '@/i18n/translate'
import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'

describe('Get company list - (e2e)', () => {
  let adminAccessToken: string
  let normalCompanyAccessToken: string

  const authenticateMiddlewareError = new MiddlewareError({
    message: translate(TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED),
    name: TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED,
    statusCode: 401,
  })

  const normalCompanyObject = createNewCompanyTestObject({
    CNPJ: '22222222222222',
    email: 'normal@company.com',
  })

  beforeAll(async () => {
    await app.ready()

    const adminAuthResponse = await request(app.server)
      .post('/company/authenticate')
      .send({
        CNPJ: env.ADMIN_ACCOUNT_CNPJ,
        password: env.ADMIN_ACCOUNT_PASSWORD,
      })

    adminAccessToken = adminAuthResponse.body.token

    await request(app.server).post('/company').send(normalCompanyObject)

    const normalAuthResponse = await request(app.server)
      .post('/company/authenticate')
      .send({
        CNPJ: normalCompanyObject.CNPJ,
        password: normalCompanyObject.password,
      })

    normalCompanyAccessToken = normalAuthResponse.body.token
  })

  afterAll(async () => {
    await app.close()
  })

  it('should allow an admin to list all companies', async () => {
    const response = await request(app.server)
      .get('/company')
      .set('Authorization', `Bearer ${adminAccessToken}`)

    expect(response.body.companies).toBeInstanceOf(Array)
    expect(response.body.companies.length).toEqual(1)
    expect(response.body.companies[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        CNPJ: normalCompanyObject.CNPJ,
        email: normalCompanyObject.email,
        name: normalCompanyObject.name,
        address: expect.objectContaining({
          id: expect.any(String),
          companyId: expect.any(String),
          clientId: null,
          country: normalCompanyObject.country,
          city: normalCompanyObject.city,
          state: normalCompanyObject.state,
          neighborhood: normalCompanyObject.neighborhood,
          street: normalCompanyObject.street,
          streetNumber: normalCompanyObject.streetNumber,
          zipCode: normalCompanyObject.zipCode,
        }),
        createdAt: expect.any(String),
        emailChecked: false,
        hasCost: false,
        textMessage: '',
        termsDate: expect.any(String),
        payDate: null,
        accessToken: null,
        lists: [],
        employees: [],
        clients: [],
        products: [],
        orders: [],
        Nfces: [],
        suppliers: [],
      }),
    )
    expect(response.statusCode).toEqual(200)
  })

  it('should not allow a normal company to list all companies', async () => {
    const response = await request(app.server)
      .get('/company')
      .set('Authorization', `Bearer ${normalCompanyAccessToken}`)

    expect(response.body).toEqual({
      message: authenticateMiddlewareError.message,
      name: authenticateMiddlewareError.name,
    })
    expect(response.statusCode).toEqual(authenticateMiddlewareError.statusCode)
  })
})
