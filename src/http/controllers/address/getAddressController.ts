import { FastifyReply, FastifyRequest } from 'fastify'

import { setupGetAddressUseCase } from '@/useCases/address/factory/setupGetAddressUseCase'
import { AddressNotFoundError } from '@/errors/addressNotFoundError'
import { IGetAddressDTO } from '@/dtos/address/IGetAddressDTO'

interface IGetAddressControllerResponse {
  id: string
  city: string
  state: string
  neighborhood: string
  street: string
  streetNumber: string
  zipCode: string
  clientId?: string | null
  companyId: string | null
}

async function getAddressController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id: companyId } = request.company
  const { clientId } = IGetAddressDTO.parse(request.body)

  try {
    const getAddressUseCase = setupGetAddressUseCase()
    const address = await getAddressUseCase.execute({ companyId, clientId })

    const responseBody: IGetAddressControllerResponse = {
      id: address.id,
      city: address.city,
      state: address.state,
      neighborhood: address.neighborhood,
      street: address.street,
      streetNumber: address.streetNumber,
      zipCode: address.zipCode,

      clientId: address.clientId || null,
      companyId: address.companyId,
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    if (error instanceof AddressNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }
    throw error
  }
}

export { getAddressController }
