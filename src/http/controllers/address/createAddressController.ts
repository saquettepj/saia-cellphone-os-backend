import { FastifyReply, FastifyRequest } from 'fastify'

import { ICreateAddressDTO } from '@/dtos/address/ICreateAddressDTO'
import { setupCreateAddressUseCase } from '@/useCases/address/factory/setupCreateAddressUseCase'
import { ClientNotFoundError } from '@/errors/clientNotFoundError'
import { ClientHasAddressError } from '@/errors/clientHasAddressError'
import { CompanyHasAddressError } from '@/errors/companyHasAddressError'

interface ICreateAddressControllerResponse {
  id: string
  city: string
  state: string
  neighborhood: string
  street: string
  streetNumber: string
  zipCode: string
  companyId: string | null
  clientId?: string | null
}

async function createAddressController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id: companyId } = request.company

  const { city, state, neighborhood, street, streetNumber, zipCode, clientId } =
    ICreateAddressDTO.parse(request.body)

  try {
    const createAddressUseCase = setupCreateAddressUseCase()

    const createAddressUseCaseReturn = await createAddressUseCase.execute({
      city,
      state,
      neighborhood,
      street,
      streetNumber,
      zipCode,
      clientId,
      companyId,
    })

    const responseBody: ICreateAddressControllerResponse = {
      id: createAddressUseCaseReturn.id,
      city: createAddressUseCaseReturn.city,
      state: createAddressUseCaseReturn.state,
      neighborhood: createAddressUseCaseReturn.neighborhood,
      street: createAddressUseCaseReturn.street,
      streetNumber: createAddressUseCaseReturn.streetNumber,
      zipCode: createAddressUseCaseReturn.zipCode,
      companyId: createAddressUseCaseReturn.companyId,
      clientId: createAddressUseCaseReturn.clientId,
    }

    return reply.status(201).send(responseBody)
  } catch (error) {
    if (error instanceof ClientNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }
    if (error instanceof ClientHasAddressError) {
      return reply.status(400).send({ message: error.message })
    }
    if (error instanceof CompanyHasAddressError) {
      return reply.status(400).send({ message: error.message })
    }
    throw error
  }
}

export { createAddressController }
