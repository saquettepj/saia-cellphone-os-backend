import { FastifyReply, FastifyRequest } from 'fastify'

import { setupUpdateClientUseCase } from '@/useCases/client/factory/setupUpdateClientUseCase'
import { ISimpleClientDTO } from '@/dtos/client/ISimpleClientDTO'
import { IUpdateClientDTO } from '@/dtos/client/IUpdateClientDTO'
import { CPFAlreadyExistsError } from '@/errors/CPFAlreadyExistsError'
import { EmailAlreadyExistsError } from '@/errors/emailAlreadyExistsError'

interface IUpdateClientControllerResponse {
  id: string
  name: string
  CPF: string
  email: string
  phone: string | null
}

async function updateClientController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id: companyId } = request.company

  const { id } = ISimpleClientDTO.parse(request.params)
  const { name, CPF, email, phone } = IUpdateClientDTO.parse(request.body)

  try {
    const updateClientUseCase = setupUpdateClientUseCase()
    const updateClientUseCaseReturn = await updateClientUseCase.execute({
      companyId,
      id,
      name,
      CPF,
      email,
      phone,
    })

    const responseBody: IUpdateClientControllerResponse = {
      id: updateClientUseCaseReturn.id,
      name: updateClientUseCaseReturn.name,
      CPF: updateClientUseCaseReturn.CPF,
      email: updateClientUseCaseReturn.email,
      phone: updateClientUseCaseReturn.phone,
    }

    return reply.status(200).send(responseBody)
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

export { updateClientController }
