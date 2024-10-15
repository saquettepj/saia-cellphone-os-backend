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
}

async function createClientController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id: companyId } = request.company
  const { name, CPF, email, phone } = ICreateClientDTO.parse(request.body)

  try {
    const createClientUseCase = setupCreateClientUseCase()
    const createClientUseCaseReturn = await createClientUseCase.execute({
      companyId,
      name,
      CPF,
      email,
      phone,
    })

    const responseBody: ICreateCompanyControllerResponse = {
      id: createClientUseCaseReturn.id,
      companyId: createClientUseCaseReturn.companyId,
      name: createClientUseCaseReturn.name,
      CPF: createClientUseCaseReturn.CPF,
      email: createClientUseCaseReturn.email,
      phone: createClientUseCaseReturn.phone,
    }

    return reply.status(201).send(responseBody)
  } catch (error) {
    if (error instanceof CPFAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    if (error instanceof EmailAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}

export { createClientController }
