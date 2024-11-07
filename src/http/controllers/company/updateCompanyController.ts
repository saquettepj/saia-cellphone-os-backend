import { FastifyReply, FastifyRequest } from 'fastify'

import { IUpdateCompanyDTO } from '@/dtos/company/IUpdateCompanyDTO'
import { setupUpdateCompanyUseCase } from '@/useCases/company/factory/setupUpdateCompanyUseCase'
import { EmailAlreadyExistsError } from '@/errors/emailAlreadyExistsError'
import { CompanyNotFoundError } from '@/errors/companyNotFoundError'

interface IUpdateCompanyControllerResponse {
  email: string
  name: string
}

async function updateCompanyController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.company
  const { email, name } = IUpdateCompanyDTO.parse(request.body)

  try {
    const updateCompanyUseCase = setupUpdateCompanyUseCase()

    const updateCompanyUseCaseReturn = await updateCompanyUseCase.execute({
      id,
      email,
      name,
    })

    const responseBody: IUpdateCompanyControllerResponse = {
      email: updateCompanyUseCaseReturn.email,
      name: updateCompanyUseCaseReturn.name,
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    if (error instanceof CompanyNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    if (error instanceof EmailAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}

export { updateCompanyController }
