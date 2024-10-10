import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createNewCompanyTestObject } from '@/test/testObjects/testObjects'
import { setupCompanyJokerRepository } from '@/test/utils/jokerRepository'

describe('Create product - (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('It should be able list companies', async () => {
    const companyJokerRepository = setupCompanyJokerRepository()

    const newCompanyObject = createNewCompanyTestObject({
      CNPJ: '11111111111112',
      email: 'teste@email2.com',
    })

    await request(app.server).post('/company').send(newCompanyObject)

    const authenticateCompanyResponse = await request(app.server)
      .post('/company/authenticate')
      .send({
        CNPJ: '12323123000000',
        password: 'pass',
      })

    const adminToken = authenticateCompanyResponse.body.token
    const newCompanyJoker = await companyJokerRepository.findByCNPJ(
      newCompanyObject.CNPJ,
    )

    const getCompanyResponse = await request(app.server)
      .get(`/company`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send()

    expect(getCompanyResponse.statusCode).toEqual(200)
    expect(getCompanyResponse.body).toEqual({
      companies: [
        {
          id: newCompanyJoker?.id,
          accountType: 'NORMAL',
          CNPJ: newCompanyObject.CNPJ,
          email: newCompanyObject.email,
          emailChecked: false,
          name: newCompanyObject.name,
          CEP: newCompanyObject.CEP,
          createdAt: newCompanyJoker?.createdAt.toISOString(),
          companyImageUrl: null,
          products: [],
        },
      ],
    })
  })

  it('It should not be able list companies without admin account', async () => {
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
    expect(getCompanyResponse.body).toEqual({
      message: 'Request not allowed!',
    })
  })
})
