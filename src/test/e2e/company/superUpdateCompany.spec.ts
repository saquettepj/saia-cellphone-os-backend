import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { v4 as uuidv4 } from 'uuid'

import { app } from '@/app'
import { MiddlewareError } from '@/errors/middlewareError'
import { CompanyNotFoundError } from '@/errors/companyNotFoundError'
import { CompanyCNPJAlreadyExistsError } from '@/errors/companyCNPJAlreadyExistsError'
import { EmailAlreadyExistsError } from '@/errors/emailAlreadyExistsError'
import { createNewCompanyTestObject } from '@/test/testObjects/testObjects'
import { setupCompanyJokerRepository } from '@/test/utils/jokerRepository'
import { translate } from '@/i18n/translate'
import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'

describe('Super Update Company - (e2e)', () => {
  let adminAccessToken: string
  let nonAdminAccessToken: string
  let existingCompanyId: string

  const companyJokerRepository = setupCompanyJokerRepository()

  const authenticateMiddlewareError = new MiddlewareError({
    message: translate(TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED),
    statusCode: 401,
  })

  const companyNotFoundError = new CompanyNotFoundError()
  const companyCNPJExistsError = new CompanyCNPJAlreadyExistsError()
  const emailExistsError = new EmailAlreadyExistsError()

  const newCompanyObject = createNewCompanyTestObject({
    CNPJ: '11111111111111',
    email: 'update@company.com',
  })

  const updateData = {
    CNPJ: '22222222222222',
    email: 'updated@company.com',
    name: 'Updated Company',
    emailChecked: true,
    payDate: '2023-12-31T00:00:00.000Z',
  }

  beforeAll(async () => {
    await app.ready()

    const adminAuthResponse = await request(app.server)
      .post('/company/authenticate')
      .send({
        CNPJ: process.env.ADMIN_ACCOUNT_CNPJ,
        password: process.env.ADMIN_ACCOUNT_PASSWORD,
      })
    adminAccessToken = adminAuthResponse.body.token

    const nonAdminCompany = createNewCompanyTestObject({
      CNPJ: '33333333333333',
      email: 'nonadmin@company.com',
    })
    await request(app.server).post('/company').send(nonAdminCompany)

    const nonAdminAuthResponse = await request(app.server)
      .post('/company/authenticate')
      .send({
        CNPJ: nonAdminCompany.CNPJ,
        password: nonAdminCompany.password,
      })
    nonAdminAccessToken = nonAdminAuthResponse.body.token

    await request(app.server).post('/company').send(newCompanyObject)
    const newCompanyJoker = await companyJokerRepository.findByCNPJ(
      newCompanyObject.CNPJ,
    )
    existingCompanyId = newCompanyJoker?.id as string
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return an error if the company does not exist', async () => {
    const nonExistentUuid = uuidv4()

    const response = await request(app.server)
      .patch(`/super/company/${nonExistentUuid}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(updateData)

    expect(response.body.message).toEqual(companyNotFoundError.message)
    expect(response.statusCode).toEqual(404)
  })

  it('should return an error when updating company to an existing email', async () => {
    const response = await request(app.server)
      .patch(`/super/company/${existingCompanyId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({ ...updateData, email: newCompanyObject.email })

    expect(response.body.message).toEqual(emailExistsError.message)
    expect(response.statusCode).toEqual(409)
  })

  it('should return an error when updating company to an existing CNPJ', async () => {
    const response = await request(app.server)
      .patch(`/super/company/${existingCompanyId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({ ...updateData, CNPJ: newCompanyObject.CNPJ })

    expect(response.body.message).toEqual(companyCNPJExistsError.message)
    expect(response.statusCode).toEqual(409)
  })

  it('should return an error if the authenticated user is not an admin', async () => {
    const response = await request(app.server)
      .patch(`/super/company/${existingCompanyId}`)
      .set('Authorization', `Bearer ${nonAdminAccessToken}`)
      .send(updateData)

    expect(response.body.message).toEqual(authenticateMiddlewareError.message)
    expect(response.statusCode).toEqual(authenticateMiddlewareError.statusCode)
  })

  it('should successfully update the company when authenticated as admin', async () => {
    const response = await request(app.server)
      .patch(`/super/company/${existingCompanyId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(updateData)

    expect(response.body).toEqual(
      expect.objectContaining({
        CNPJ: updateData.CNPJ,
        email: updateData.email,
        name: updateData.name,
        emailChecked: updateData.emailChecked,
        payDate: expect.any(String),
      }),
    )
    expect(response.statusCode).toEqual(200)
  })
})
