import { FastifyReply, FastifyRequest } from 'fastify'

import { IAuthenticateCompanyDTO } from '@/dtos/company/IAuthenticateCompanyDTO'
import { CompanyCredentialsError } from '@/errors/companyCredentialsError'
import { setupAuthenticateCompanyUseCase } from '@/useCases/company/factory/setupAuthenticateCompanyUseCase'

interface IAuthenticateCompanyControllerResponse {
  company: {
    id: string
    name: string
    email: string
    accountType: string
    payType: string | null
    payDate: Date | null
    termsDate: Date | null
    accessTokenActivatedAt: Date | null
  }
  token: string
}

async function authenticateCompanyController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { CNPJ, password } = IAuthenticateCompanyDTO.parse(request.body)

  try {
    const authenticateCompanyUseCase = setupAuthenticateCompanyUseCase()

    const authenticateCompanyUseCaseReturn =
      await authenticateCompanyUseCase.execute({
        CNPJ,
        password,
      })

    const responseBody: IAuthenticateCompanyControllerResponse = {
      company: authenticateCompanyUseCaseReturn.company,
      token: authenticateCompanyUseCaseReturn.token,
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    if (error instanceof CompanyCredentialsError) {
      return reply
        .status(401)
        .send({ message: error.message, name: error.name })
    }

    throw error
  }
}

export { authenticateCompanyController }
