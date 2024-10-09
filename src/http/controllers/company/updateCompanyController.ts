import { FastifyReply, FastifyRequest } from 'fastify'

import { IUpdateCompanyDTO } from '@/dtos/company/IUpdateCompanyDTO'
import { setupUpdateCompanyUseCase } from '@/useCases/company/factory/setupUpdateCompanyUseCase'
import { CompanyCredentialsError } from '@/errors/companyCredentialsError'

interface IUpdateCompanyControllerResponse {
  CNPJ: string
  email: string
  name: string
  CEP: string
}

async function updateCompanyController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { CEP, CNPJ, email, name, password } = IUpdateCompanyDTO.parse(
    request.body,
  )

  try {
    const updateCompanyUseCase = setupUpdateCompanyUseCase()

    const updateCompanyUseCaseReturn = await updateCompanyUseCase.execute({
      CNPJ,
      password,
      CEP,
      email,
      name,
    })

    const responseBody: IUpdateCompanyControllerResponse = {
      CNPJ: updateCompanyUseCaseReturn.CNPJ,
      email: updateCompanyUseCaseReturn.email,
      name: updateCompanyUseCaseReturn.name,
      CEP: updateCompanyUseCaseReturn.CEP,
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    if (error instanceof CompanyCredentialsError) {
      return reply.status(401).send({ message: error.message })
    }
  }
}

export { updateCompanyController }
