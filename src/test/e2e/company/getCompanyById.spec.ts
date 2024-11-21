import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { v4 as uuidv4 } from 'uuid'

import { app } from '@/app'
import { MiddlewareError } from '@/errors/middlewareError'
import { CompanyNotFoundError } from '@/errors/companyNotFoundError'
import { createNewCompanyTestObject } from '@/test/testObjects/testObjects'
import { setupCompanyJokerRepository } from '@/test/utils/jokerRepository'
import { env } from '@/env'
import { translate } from '@/i18n/translate'
import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'

describe('Get Company By ID - (e2e)', () => {
  let adminAccessToken: string
  let nonAdminAccessToken: string
  let targetCompanyId: string
  let nonAdminCompanyId: string

  const companyJokerRepository = setupCompanyJokerRepository()

  const notAllowedError = new MiddlewareError({
    message: translate(TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED),
    statusCode: 401,
  })

  const companyNotFoundError = new CompanyNotFoundError()

  const adminCompanyObject = createNewCompanyTestObject({
    CNPJ: env.ADMIN_ACCOUNT_CNPJ,
    password: env.ADMIN_ACCOUNT_PASSWORD,
  })

  const nonAdminCompanyObject = createNewCompanyTestObject({
    CNPJ: '22222222222222',
    email: 'nonadmin@company.com',
  })

  const targetCompanyObject = createNewCompanyTestObject({
    CNPJ: '33333333333333',
    email: 'target@company.com',
  })

  beforeAll(async () => {
    await app.ready()

    await request(app.server).post('/company').send(adminCompanyObject)
    const adminAuthResponse = await request(app.server)
      .post('/company/authenticate')
      .send({
        CNPJ: adminCompanyObject.CNPJ,
        password: adminCompanyObject.password,
      })
    adminAccessToken = adminAuthResponse.body.token

    await request(app.server).post('/company').send(nonAdminCompanyObject)
    const nonAdminAuthResponse = await request(app.server)
      .post('/company/authenticate')
      .send({
        CNPJ: nonAdminCompanyObject.CNPJ,
        password: nonAdminCompanyObject.password,
      })
    nonAdminAccessToken = nonAdminAuthResponse.body.token

    const nonAdminCompany = await companyJokerRepository.findByCNPJ(
      nonAdminCompanyObject.CNPJ,
    )
    nonAdminCompanyId = nonAdminCompany?.id as string

    await request(app.server).post('/company').send(targetCompanyObject)
    const targetCompany = await companyJokerRepository.findByCNPJ(
      targetCompanyObject.CNPJ,
    )
    targetCompanyId = targetCompany?.id as string
  })

  afterAll(async () => {
    await app.close()
  })

  it('should not allow listing a company if it is not owned by the authenticated non-admin company', async () => {
    const response = await request(app.server)
      .get(`/company/${targetCompanyId}`)
      .set('Authorization', `Bearer ${nonAdminAccessToken}`)

    expect(response.body.message).toEqual(notAllowedError.message)
    expect(response.statusCode).toEqual(notAllowedError.statusCode)
  })

  it('should return an error if the company does not exist', async () => {
    const nonExistentUuid = uuidv4()

    const response = await request(app.server)
      .get(`/company/${nonExistentUuid}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)

    expect(response.body.message).toEqual(companyNotFoundError.message)
    expect(response.statusCode).toEqual(404)
  })

  it('should allow a non-admin company to list itself', async () => {
    const response = await request(app.server)
      .get(`/company/${nonAdminCompanyId}`)
      .set('Authorization', `Bearer ${nonAdminAccessToken}`)

    expect(response.body.company).toEqual(
      expect.objectContaining({
        id: nonAdminCompanyId,
        CNPJ: nonAdminCompanyObject.CNPJ,
        email: nonAdminCompanyObject.email,
        name: nonAdminCompanyObject.name,
        createdAt: expect.any(String),
        emailChecked: false,
        payDate: null,
        termsDate: null,
        accessToken: null,
        address: null,
        lists: [],
        employees: [],
        clients: [],
        products: [],
        orders: [],
        Nfes: [],
        suppliers: [],
      }),
    )
    expect(response.statusCode).toEqual(200)
  })

  it('should allow an admin company to list another company', async () => {
    const response = await request(app.server)
      .get(`/company/${targetCompanyId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)

    expect(response.body.company).toEqual(
      expect.objectContaining({
        id: targetCompanyId,
        CNPJ: targetCompanyObject.CNPJ,
        email: targetCompanyObject.email,
        name: targetCompanyObject.name,
        createdAt: expect.any(String),
        emailChecked: expect.any(Boolean),
        accessToken: null,
        address: null,
        employees: [],
        clients: [],
        products: [],
        orders: [],
        Nfes: [],
      }),
    )
    expect(response.statusCode).toEqual(200)
  })
})
