import { FastifyReply, FastifyRequest } from 'fastify'

import { ICreateNfceDTO } from '@/dtos/nfce/ICreateNfceDTO'
import { setupCreateNfceUseCase } from '@/useCases/nfce/factory/setupCreateNfceUseCase'
import { CNPJDataNotFoundError } from '@/errors/CNPJDataNotFoundError'
import { ClientAddressNotFoundError } from '@/errors/clientAddressNotFoundError'
import { ClientNotFoundError } from '@/errors/clientNotFoundError'
import { SEFAZError } from '@/errors/SEFAZError'
import { SendNfceSefazError } from '@/errors/sendNfceSefazError'
import { OrderAlreadyHasInvoiceError } from '@/errors/orderAlreadyHasInvoiceError'
import { InvalidCertificateError } from '@/errors/invalidCertificateError'

interface ICreateNfceControllerResponse {
  number?: string | null
  chNFe?: string | null
  nProt?: string | null
  xml?: string | null
  companyId?: string | null
  clientId?: string | null
  orderId?: string | null
  createdAt?: Date | string
}

async function createNfceController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id: companyId } = request.company

  const { orderId, cEANDisabled } = ICreateNfceDTO.parse(request.body)

  try {
    const createNfceUseCase = setupCreateNfceUseCase()

    const createNfceUseCaseReturn = await createNfceUseCase.execute({
      companyId,
      orderId,
      cEANDisabled,
    })

    const responseBody: ICreateNfceControllerResponse = {
      number: createNfceUseCaseReturn?.number,
      chNFe: createNfceUseCaseReturn?.chNFe,
      nProt: createNfceUseCaseReturn?.nProt,
      xml: createNfceUseCaseReturn?.xml,
      companyId: createNfceUseCaseReturn?.companyId,
      clientId: createNfceUseCaseReturn?.clientId,
      orderId: createNfceUseCaseReturn?.orderId,
      createdAt: createNfceUseCaseReturn?.createdAt,
    }

    return reply.status(201).send(responseBody)
  } catch (error) {
    if (error instanceof InvalidCertificateError) {
      return reply
        .status(400)
        .send({ message: error.message, name: error.name })
    }
    if (error instanceof ClientNotFoundError) {
      return reply
        .status(404)
        .send({ message: error.message, name: error.name })
    }
    if (error instanceof ClientAddressNotFoundError) {
      return reply
        .status(404)
        .send({ message: error.message, name: error.name })
    }
    if (error instanceof OrderAlreadyHasInvoiceError) {
      return reply
        .status(400)
        .send({ message: error.message, name: error.name })
    }
    if (error instanceof CNPJDataNotFoundError) {
      return reply
        .status(404)
        .send({ message: error.message, name: error.name })
    }
    if (error instanceof SendNfceSefazError) {
      return reply
        .status(500)
        .send({ message: error.message, name: error.name })
    }
    if (error instanceof SEFAZError) {
      return reply
        .status(500)
        .send({ message: error.message, name: error.name })
    }
    throw error
  }
}

export { createNfceController }
