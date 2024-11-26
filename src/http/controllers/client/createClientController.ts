import { FastifyReply, FastifyRequest } from 'fastify'

import { ICreateClientDTO } from '@/dtos/client/ICreateClientDTO'
import { setupCreateClientUseCase } from '@/useCases/client/factory/setupCreateClientUseCase'
import { CPFAlreadyExistsError } from '@/errors/CPFAlreadyExistsError'
import { EmailAlreadyExistsError } from '@/errors/emailAlreadyExistsError'

interface ICreateCompanyControllerResponse {
  id: string
  companyId: string
  name: string
  CPF: string
  email: string
  phone: string | null
  address?: {
    country: string
    city: string
    state: string
    neighborhood: string
    street: string
    streetNumber: string
    zipCode: string
    clientId: string | null
  } | null
}

async function createClientController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id: companyId } = request.company

  const { name, CPF, email, phone, address } = ICreateClientDTO.parse(
    request.body,
  )

  try {
    const createClientUseCase = setupCreateClientUseCase()
    const createClientUseCaseReturn = await createClientUseCase.execute({
      companyId,
      name,
      CPF,
      email,
      phone,
      address,
    })

    const responseBody: ICreateCompanyControllerResponse = {
      id: createClientUseCaseReturn.id,
      companyId: createClientUseCaseReturn.companyId,
      name: createClientUseCaseReturn.name,
      CPF: createClientUseCaseReturn.CPF,
      email: createClientUseCaseReturn.email,
      phone: createClientUseCaseReturn.phone,
      address: createClientUseCaseReturn.address,
    }

    return reply.status(201).send(responseBody)
  } catch (error) {
    if (error instanceof CPFAlreadyExistsError) {
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

export { createClientController }
