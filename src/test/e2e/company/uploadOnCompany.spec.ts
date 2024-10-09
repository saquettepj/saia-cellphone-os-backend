import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createNewCompanyTestObject } from '@/test/testObjects/testObjects'
import { getCompanyEmailConfirmationCode } from '@/test/utils/getCompanyEmailConfirmationCode'

describe('Upload on company - (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('It should be able to upload image on company', async () => {
    const newCompanyObject = createNewCompanyTestObject()

    const createCompanyResponse = await request(app.server)
      .post('/company')
      .send(newCompanyObject)

    const authenticateCompanyResponse = await request(app.server)
      .post('/company/authenticate')
      .send({
        CNPJ: newCompanyObject.CNPJ,
        password: newCompanyObject.password,
      })

    const newCompanyId = createCompanyResponse.body.id
    const newCompanyToken = authenticateCompanyResponse.body.token

    const companyEmailConfirmationCode =
      await getCompanyEmailConfirmationCode(newCompanyId)

    await request(app.server)
      .patch(`/email/confirm`)
      .set('Authorization', `Bearer ${newCompanyToken}`)
      .send({
        emailConfirmationCode: companyEmailConfirmationCode,
      })

    const uploadCompanyImageResponse = await request(app.server)
      .patch(`/company/upload-company-image`)
      .set('Authorization', `Bearer ${newCompanyToken}`)
      .attach('image', './src/test/utils/images/imageTest.png')

    expect(uploadCompanyImageResponse.statusCode).toEqual(200)
  })

  it('It should be able to remove image on company', async () => {
    const newCompanyObject = createNewCompanyTestObject()

    const createCompanyResponse = await request(app.server)
      .post('/company')
      .send(newCompanyObject)

    const authenticateCompanyResponse = await request(app.server)
      .post('/company/authenticate')
      .send({
        CNPJ: newCompanyObject.CNPJ,
        password: newCompanyObject.password,
      })

    const newCompanyId = createCompanyResponse.body.id
    const newCompanyToken = authenticateCompanyResponse.body.token

    const companyEmailConfirmationCode =
      await getCompanyEmailConfirmationCode(newCompanyId)

    await request(app.server)
      .patch(`/email/confirm`)
      .set('Authorization', `Bearer ${newCompanyToken}`)
      .send({
        emailConfirmationCode: companyEmailConfirmationCode,
      })

    await request(app.server)
      .patch(`/company/upload-company-image`)
      .set('Authorization', `Bearer ${newCompanyToken}`)
      .attach('image', './src/test/utils/images/imageTest.png')

    const removeCompanyImageResponse = await request(app.server)
      .patch(`/company/remove-company-image`)
      .set('Authorization', `Bearer ${newCompanyToken}`)

    expect(removeCompanyImageResponse.statusCode).toEqual(200)
  })
})
