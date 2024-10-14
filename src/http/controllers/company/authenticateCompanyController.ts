import { FastifyReply, FastifyRequest } from 'fastify'

import { IAuthenticateCompanyDTO } from '@/dtos/company/IAuthenticateCompanyDTO'
import { CompanyCredentialsError } from '@/errors/companyCredentialsError'
import { setupAuthenticateCompanyUseCase } from '@/useCases/company/factory/setupAuthenticateCompanyUseCase'

interface IAuthenticateCompanyControllerResponse {
  company: {
    name: string
    email: string
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

    const responseBody: IAuthenticateCompanyControllerResponse =
      await authenticateCompanyUseCase.execute({
        CNPJ,
        password,
      })

    return reply.status(200).send(responseBody)
  } catch (error) {
    if (error instanceof CompanyCredentialsError) {
      return reply.status(401).send({ message: error.message })
    }

    throw error
  }
}

export { authenticateCompanyController }
