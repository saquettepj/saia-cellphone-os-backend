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
  address: {
    country?: string
    city?: string
    state?: string
    neighborhood?: string
    street?: string
    streetNumber?: string
    zipCode?: string
  }
}

async function createCompanyController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const {
    CNPJ,
    email,
    name,
    country,
    city,
    state,
    neighborhood,
    street,
    streetNumber,
    zipCode,
    password,
    passwordConfirmation,
  } = ICreateCompanyDTO.parse(request.body)

  try {
    const createCompanyUseCase = setupCreateCompanyUseCase()

    const createCompanyUseCaseReturn = await createCompanyUseCase.execute({
      CNPJ,
      email,
      name,
      country,
      city,
      state,
      neighborhood,
      street,
      streetNumber,
      zipCode,
      termsDate: new Date(),
      password,
      passwordConfirmation,
    })

    const responseBody: ICreateCompanyControllerResponse = {
      id: createCompanyUseCaseReturn.id,
      CNPJ: createCompanyUseCaseReturn.CNPJ,
      email: createCompanyUseCaseReturn.email,
      emailChecked: createCompanyUseCaseReturn.emailChecked,
      name: createCompanyUseCaseReturn.name,
      address: {
        country: createCompanyUseCaseReturn.address?.country,
        zipCode: createCompanyUseCaseReturn.address?.zipCode,
        state: createCompanyUseCaseReturn.address?.state,
        city: createCompanyUseCaseReturn.address?.city,
        neighborhood: createCompanyUseCaseReturn.address?.neighborhood,
        street: createCompanyUseCaseReturn.address?.street,
        streetNumber: createCompanyUseCaseReturn.address?.streetNumber,
      },
    }

    return reply.status(201).send(responseBody)
  } catch (error) {
    if (error instanceof CompanyCNPJAlreadyExistsError) {
      return reply
        .status(409)
        .send({ message: error.message, name: error.name })
    }
    if (error instanceof PasswordConfirmationIsDifferentError) {
      return reply
        .status(400)
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

export { createCompanyController }
