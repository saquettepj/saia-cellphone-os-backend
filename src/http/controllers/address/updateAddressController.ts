import { FastifyReply, FastifyRequest } from 'fastify'

import { IUpdateAddressDTO } from '@/dtos/address/IUpdateAddressDTO'
import { setupUpdateAddressUseCase } from '@/useCases/address/factory/setupUpdateAddressUseCase'
import { AddressNotFoundError } from '@/errors/addressNotFoundError'
import { ClientNotFoundError } from '@/errors/clientNotFoundError'

interface IUpdateAddressControllerResponse {
  id?: string
  country?: string
  city?: string
  state?: string
  neighborhood?: string
  street?: string
  streetNumber?: string
  zipCode?: string
  clientId?: string | null
  companyId?: string | null
}

async function updateAddressController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id: companyId } = request.company

  const {
    clientId,
    country,
    city,
    state,
    neighborhood,
    street,
    streetNumber,
    zipCode,
  } = IUpdateAddressDTO.parse(request.body)

  try {
    const updateAddressUseCase = setupUpdateAddressUseCase()
    const updatedAddress = await updateAddressUseCase.execute({
      companyId,
      clientId,
      country,
      city,
      state,
      neighborhood,
      street,
      streetNumber,
      zipCode,
    })

    const responseBody: IUpdateAddressControllerResponse = {
      id: updatedAddress?.id,
      country: updatedAddress?.country,
      city: updatedAddress?.city,
      state: updatedAddress?.state,
      neighborhood: updatedAddress?.neighborhood,
      street: updatedAddress?.street,
      streetNumber: updatedAddress?.streetNumber,
      zipCode: updatedAddress?.zipCode,
      clientId: updatedAddress?.clientId,
      companyId: updatedAddress?.companyId,
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    if (error instanceof AddressNotFoundError) {
      return reply
        .status(404)
        .send({ message: error.message, name: error.name })
    }

    if (error instanceof ClientNotFoundError) {
      return reply
        .status(404)
        .send({ message: error.message, name: error.name })
    }

    throw error
  }
}

export { updateAddressController }
