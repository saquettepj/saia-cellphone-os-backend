import { FastifyReply, FastifyRequest } from 'fastify'

import { ICreateCompanyDTO } from '@/dtos/company/ICreateCompanyDTO'
import { CompanyCNPJAlreadyExistsError } from '@/errors/companyCNPJAlreadyExistsError'
import { setupCreateCompanyUseCase } from '@/useCases/company/factory/setupCreateCompanyUseCase'
import { EmailAlreadyExistsError } from '@/errors/emailAlreadyExistsError'
import { PasswordConfirmationIsDifferentError } from '@/errors/passwordConfirmationIsDifferentError'

interface ICreateCompanyControllerResponse {
  id: string
  CNPJ: string
  email: string
  emailChecked: boolean
  name: string
}

async function createCompanyController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { CNPJ, email, name, password, passwordConfirmation } =
    ICreateCompanyDTO.parse(request.body)

  try {
    const createCompanyUseCase = setupCreateCompanyUseCase()

    const createCompanyUseCaseReturn = await createCompanyUseCase.execute({
      CNPJ,
      email,
      name,
      password,
      passwordConfirmation,
    })

    const responseBody: ICreateCompanyControllerResponse = {
      id: createCompanyUseCaseReturn.id,
      CNPJ: createCompanyUseCaseReturn.CNPJ,
      email: createCompanyUseCaseReturn.email,
      emailChecked: createCompanyUseCaseReturn.emailChecked,
      name: createCompanyUseCaseReturn.name,
    }

    return reply.status(201).send(responseBody)
  } catch (error) {
    if (error instanceof CompanyCNPJAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }
    if (error instanceof PasswordConfirmationIsDifferentError) {
      return reply.status(400).send({ message: error.message })
    }
    if (error instanceof EmailAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}

export { createCompanyController }
