import { FastifyReply, FastifyRequest } from 'fastify'

import { setupGetClientUseCase } from '@/useCases/client/factory/setupGetClientUseCase'
import { IGetClientDTO } from '@/dtos/client/IGetClientDTO'

interface IGetClientControllerResponse {
  id: string
  companyId: string
  name: string
  CPF: string
  email?: string | null
  phone?: string | null
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

async function getClientController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id: companyId } = request.company

  const { name, CPF, email, phone } = IGetClientDTO.parse(request.body)

  try {
    const getClientUseCase = setupGetClientUseCase()

    const getClientUseCaseReturn = await getClientUseCase.execute({
      companyId,
      name,
      CPF,
      email,
      phone,
    })

    const responseBody: IGetClientControllerResponse[] =
      getClientUseCaseReturn.map((getClientUseCaseReturn) => ({
        id: getClientUseCaseReturn.id,
        companyId: getClientUseCaseReturn.companyId,
        name: getClientUseCaseReturn.name,
        CPF: getClientUseCaseReturn.CPF,
        email: getClientUseCaseReturn.email,
        phone: getClientUseCaseReturn.phone,
        address: getClientUseCaseReturn.address,
      }))

    return reply.status(200).send(responseBody)
  } catch (error) {
    throw error
  }
}

export { getClientController }
