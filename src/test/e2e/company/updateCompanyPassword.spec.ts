import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createNewCompanyTestObject } from '@/test/testObjects/testObjects'
import { setupCompanyJokerRepository } from '@/test/utils/jokerRepository'
import { CompanyCredentialsError } from '@/errors/companyCredentialsError'
import { PasswordConfirmationIsDifferentError } from '@/errors/passwordConfirmationIsDifferentError'

describe('Update company password - (e2e)', () => {
  let companyToken: string
  let otherCompanyToken: string
  const companyCredentialsError = new CompanyCredentialsError()
  const passwordConfirmationIsDifferentError =
    new PasswordConfirmationIsDifferentError()

  const companyJokerRepository = setupCompanyJokerRepository()

  const newCompanyObject = createNewCompanyTestObject({
    CNPJ: '11111111111111',
    email: 'test@company.com',
    password: 'OldPassword1!',
  })

  const otherCompanyObject = createNewCompanyTestObject({
    CNPJ: '22222222222222',
    email: 'other@company.com',
    password: 'OtherPassword1!',
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

    await request(app.server)
      .post('/email/send-confirmation')
      .set('Authorization', `Bearer ${companyToken}`)

    const newCompanyJoker = await companyJokerRepository.findByCNPJ(
      newCompanyObject.CNPJ,
    )

    await request(app.server)
      .patch(`/email/confirm`)
      .set('Authorization', `Bearer ${companyToken}`)
      .send({
        emailConfirmationCode: newCompanyJoker?.emailConfirmationCode,
      })

    await request(app.server).post('/company').send(otherCompanyObject)

    const authenticateOtherCompanyResponse = await request(app.server)
      .post('/company/authenticate')
      .send({
        CNPJ: otherCompanyObject.CNPJ,
        password: otherCompanyObject.password,
      })

    otherCompanyToken = authenticateOtherCompanyResponse.body.token
  })

  afterAll(async () => {
    await app.close()
  })

  it('should update the company password and reset email confirmation fields', async () => {
    const updatePasswordData = {
      CNPJ: newCompanyObject.CNPJ,
      currentPassword: newCompanyObject.password,
      newPassword: 'NewPassword2!',
      passwordConfirmation: 'NewPassword2!',
    }

    const response = await request(app.server)
      .patch('/company/update-password')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(updatePasswordData)

    expect(response.statusCode).toEqual(200)

    const updatedCompany = await companyJokerRepository.findByCNPJ(
      updatePasswordData.CNPJ,
    )

    expect(updatedCompany?.emailConfirmationCode).toBeNull()
    expect(updatedCompany?.emailChecked).toBe(false)
  })

  it('should return error when current password is incorrect', async () => {
    await request(app.server)
      .post('/email/send-confirmation')
      .set('Authorization', `Bearer ${companyToken}`)

    const newCompanyJoker = await companyJokerRepository.findByCNPJ(
      newCompanyObject.CNPJ,
    )

    await request(app.server)
      .patch(`/email/confirm`)
      .set('Authorization', `Bearer ${companyToken}`)
      .send({
        emailConfirmationCode: newCompanyJoker?.emailConfirmationCode,
      })

    const updatePasswordData = {
      CNPJ: newCompanyObject.CNPJ,
      currentPassword: 'WrongPassword1!',
      newPassword: 'NewPassword2!',
      passwordConfirmation: 'NewPassword2!',
    }

    const response = await request(app.server)
      .patch('/company/update-password')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(updatePasswordData)

    expect(response.statusCode).toEqual(401)
    expect(response.body.message).toEqual(companyCredentialsError.message)
  })

  it('should return error when password confirmation does not match', async () => {
    await request(app.server)
      .post('/email/send-confirmation')
      .set('Authorization', `Bearer ${companyToken}`)

    const newCompanyJoker = await companyJokerRepository.findByCNPJ(
      newCompanyObject.CNPJ,
    )

    await request(app.server)
      .patch(`/email/confirm`)
      .set('Authorization', `Bearer ${companyToken}`)
      .send({
        emailConfirmationCode: newCompanyJoker?.emailConfirmationCode,
      })

    const updatePasswordData = {
      CNPJ: newCompanyObject.CNPJ,
      currentPassword: newCompanyObject.password,
      newPassword: 'NewPassword3!',
      passwordConfirmation: 'DifferentPassword4!',
    }

    const response = await request(app.server)
      .patch('/company/update-password')
      .set('Authorization', `Bearer ${companyToken}`)
      .send(updatePasswordData)

    expect(response.body.message).toEqual(
      passwordConfirmationIsDifferentError.message,
    )
    expect(response.statusCode).toEqual(400)
  })

  it('should not allow another company to update the password', async () => {
    await request(app.server)
      .post('/email/send-confirmation')
      .set('Authorization', `Bearer ${companyToken}`)

    const newCompanyJoker = await companyJokerRepository.findByCNPJ(
      newCompanyObject.CNPJ,
    )

    await request(app.server)
      .patch(`/email/confirm`)
      .set('Authorization', `Bearer ${companyToken}`)
      .send({
        emailConfirmationCode: newCompanyJoker?.emailConfirmationCode,
      })

    const otherCompanyJoker = await companyJokerRepository.findByCNPJ(
      otherCompanyObject.CNPJ,
    )

    await request(app.server)
      .patch(`/email/confirm`)
      .set('Authorization', `Bearer ${otherCompanyToken}`)
      .send({
        emailConfirmationCode: otherCompanyJoker?.emailConfirmationCode,
      })

    const updatePasswordData = {
      CNPJ: newCompanyObject.CNPJ,
      currentPassword: newCompanyObject.password,
      newPassword: 'NewPassword2!',
      passwordConfirmation: 'NewPassword2!',
    }

    const response = await request(app.server)
      .patch('/company/update-password')
      .set('Authorization', `Bearer ${otherCompanyToken}`)
      .send(updatePasswordData)

    expect(response.body.message).toEqual(companyCredentialsError.message)
    expect(response.statusCode).toEqual(401)
  })
})
