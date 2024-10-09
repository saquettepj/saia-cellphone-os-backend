import { FastifyReply, FastifyRequest } from 'fastify'

import { ICreateCompanyDTO } from '@/dtos/company/ICreateCompanyDTO'
import { CompanyCNPJAlreadyExistsError } from '@/errors/companyCNPJAlreadyExistsError'
import { CompanyEmailAlreadyExistsError } from '@/errors/companyEmailAlreadyExistsError'
import { setupCreateCompanyUseCase } from '@/useCases/company/factory/setupCreateCompanyUseCase'

interface ICreateCompanyControllerResponse {
  CNPJ: string
  email: string
  emailChecked: boolean
  name: string
  CEP: string
  companyImageUrl?: string | null
}

async function createCompanyController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { CEP, CNPJ, email, name, password, passwordConfirmation } =
    ICreateCompanyDTO.parse(request.body)

  try {
    const createCompanyUseCase = setupCreateCompanyUseCase()

    const createCompanyUseCaseReturn = await createCompanyUseCase.execute({
      CEP,
      CNPJ,
      email,
      name,
      password,
      passwordConfirmation,
    })

    const responseBody: ICreateCompanyControllerResponse = {
      CNPJ: createCompanyUseCaseReturn.CNPJ,
      email: createCompanyUseCaseReturn.email,
      emailChecked: createCompanyUseCaseReturn.emailChecked,
      name: createCompanyUseCaseReturn.name,
      CEP: createCompanyUseCaseReturn.CEP,
      companyImageUrl: createCompanyUseCaseReturn.companyImageUrl,
    }

    return reply.status(201).send(responseBody)
  } catch (error) {
    if (error instanceof CompanyCNPJAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }
    if (error instanceof CompanyEmailAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }
  }
}

export { createCompanyController }
