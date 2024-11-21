import { FastifyReply, FastifyRequest } from 'fastify'

import { setupSuperUpdateCompanyUseCase } from '@/useCases/company/factory/setupSuperUpdateCompanyUseCase'
import { EmailAlreadyExistsError } from '@/errors/emailAlreadyExistsError'
import { ISuperUpdateCompanyDTO } from '@/dtos/company/ISuperUpdateCompanyDTO'
import { ISimpleCompanyDTO } from '@/dtos/company/ISimpleCompanyDTO'
import { CompanyNotFoundError } from '@/errors/companyNotFoundError'
import { CompanyCNPJAlreadyExistsError } from '@/errors/companyCNPJAlreadyExistsError'

interface IUpdateCompanyControllerResponse {
  CNPJ: string
  email: string
  name: string
  emailChecked: boolean
  payDate: Date | null
}

async function superUpdateCompanyController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = ISimpleCompanyDTO.parse(request.params)
  const { CNPJ, email, name, emailChecked, payDate } =
    ISuperUpdateCompanyDTO.parse(request.body)

  try {
    const superUpdateCompanyUseCase = setupSuperUpdateCompanyUseCase()

    const updateCompanyUseCaseReturn = await superUpdateCompanyUseCase.execute({
      id,
      CNPJ,
      email,
      name,
      emailChecked,
      payDate,
    })

    const responseBody: IUpdateCompanyControllerResponse = {
      CNPJ: updateCompanyUseCaseReturn.CNPJ,
      email: updateCompanyUseCaseReturn.email,
      name: updateCompanyUseCaseReturn.name,
      emailChecked: updateCompanyUseCaseReturn.emailChecked,
      payDate: updateCompanyUseCaseReturn?.payDate,
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    if (error instanceof CompanyNotFoundError) {
      return reply
        .status(404)
        .send({ message: error.message, name: error.name })
    }

    if (error instanceof CompanyCNPJAlreadyExistsError) {
      return reply
        .status(409)
        .send({ message: error.message, name: error.name })
    }

    if (error instanceof EmailAlreadyExistsError) {
      return reply
        .status(409)
        .send({ message: error.message, name: error.name })
    }

    throw error
  }
}

export { superUpdateCompanyController }
