import { FastifyReply, FastifyRequest } from 'fastify'

import { setupDeleteAddressUseCase } from '@/useCases/address/factory/setupDeleteAddressUseCase'
import { AddressNotFoundError } from '@/errors/addressNotFoundError'
import { ISimpleAddressDTO } from '@/dtos/address/ISimpleAddressDTO'

async function deleteAddressController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = ISimpleAddressDTO.parse(request.params)

  try {
    const deleteAddressUseCase = setupDeleteAddressUseCase()
    await deleteAddressUseCase.execute(id)

    return reply.status(204).send()
  } catch (error) {
    if (error instanceof AddressNotFoundError) {
      return reply
        .status(404)
        .send({ message: error.message, name: error.name })
    }

    throw error
  }
}

export { deleteAddressController }
