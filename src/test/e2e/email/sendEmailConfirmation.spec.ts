import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { v4 as uuidv4 } from 'uuid'

import { app } from '@/app'
import { createNewCompanyTestObject } from '@/test/testObjects/testObjects'
import { MiddlewareError } from '@/errors/middlewareError'
import { EmailAlreadyConfirmedError } from '@/errors/emailAlreadyConfirmedError'
import { generateRandomNumber } from '@/utils/randomNumberGenerator'
import { setupCompanyJokerRepository } from '@/test/utils/jokerRepository'
import { translate } from '@/i18n/translate'
import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'

describe.skip('Email Confirmation - (e2e)', () => {
  let companyToken: string

  const companyJokerRepository = setupCompanyJokerRepository()

  const authenticateCompanyMiddlewareError = new MiddlewareError({
    message: translate(TranslationKeysEnum.ERROR_TOKEN_MISSING),
    name: TranslationKeysEnum.ERROR_TOKEN_MISSING,
    statusCode: 401,
  })

  const emailAlreadyConfirmedError = new EmailAlreadyConfirmedError()

  const newCompanyObject = createNewCompanyTestObject({
    CNPJ: '33333333333333',
    email: 'emailtest@company.com',
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
  })

  afterAll(async () => {
    await app.close()
  })

  it('should send email confirmation successfully', async () => {
    const response = await request(app.server)
      .post('/email/send-confirmation')
      .set('Authorization', `Bearer ${companyToken}`)

    expect(response.statusCode).toEqual(200)
  })

  it('should not send email confirmation without authentication', async () => {
    const response = await request(app.server).post('/email/send-confirmation')

    expect(response.statusCode).toEqual(
      authenticateCompanyMiddlewareError.statusCode,
    )
    expect(response.body).toEqual({
      message: authenticateCompanyMiddlewareError.message,
      name: authenticateCompanyMiddlewareError.name,
    })
  })

  it('should not confirm email already confirmed', async () => {
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

    const response = await request(app.server)
      .patch('/email/confirm')
      .set('Authorization', `Bearer ${companyToken}`)
      .send({
        emailConfirmationCode: generateRandomNumber(6),
      })

    expect(response.body).toEqual({
      message: emailAlreadyConfirmedError.message,
      name: emailAlreadyConfirmedError.name,
    })
    expect(response.statusCode).toEqual(400)
  })
})
