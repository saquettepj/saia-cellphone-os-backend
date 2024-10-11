import { FastifyReply, FastifyRequest } from 'fastify'

import { ICreateClientDTO } from '@/dtos/client/ICreateClientDTO'
import { setupCreateClientUseCase } from '@/useCases/client/factory/setupCreateClientUseCase'
import { CPFAlreadyExistsError } from '@/errors/CPFAlreadyExistsError'
import { EmailAlreadyExistsError } from '@/errors/emailAlreadyExistsError'

interface ICreateClientControllerResponse {
  name: string
  CPF: string
  email: string
  phone?: string | null
  address?: string | null
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
      name,
      CPF,
      email,
      phone,
      address,
      companyId,
    })

    const responseBody: ICreateClientControllerResponse = {
      name: createClientUseCaseReturn.name,
      CPF: createClientUseCaseReturn.CPF,
      email: createClientUseCaseReturn.email,
      phone: createClientUseCaseReturn?.phone,
      address: createClientUseCaseReturn?.address,
    }

    return reply.status(201).send(responseBody)
  } catch (error) {
    if (error instanceof CPFAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }
    if (error instanceof EmailAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }
  }
}

export { createClientController }
