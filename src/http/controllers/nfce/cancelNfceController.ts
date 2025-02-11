import { FastifyReply, FastifyRequest } from 'fastify'

import { SEFAZError } from '@/errors/SEFAZError'
import { ICancelNfceDTO } from '@/dtos/nfce/ICancelNfceDTO'
import { InvoiceDataNotFoundError } from '@/errors/invoiceDataNotFoundError'
import { CancelNfceSefazError } from '@/errors/cancelNfceSefazError'
import { setupCancelNfceUseCase } from '@/useCases/nfce/factory/setupCancelNfceUseCase'
import { InvalidCertificateError } from '@/errors/invalidCertificateError'

async function cancelNfceController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id: companyId } = request.company
  const { orderId, xJust } = ICancelNfceDTO.parse(request.body)

  try {
    const cancelNfceUseCase = setupCancelNfceUseCase()

    await cancelNfceUseCase.execute({
      orderId,
      companyId,
      xJust,
    })

    return reply.status(200).send()
  } catch (error) {
    if (error instanceof InvoiceDataNotFoundError) {
      return reply
        .status(500)
        .send({ message: error.message, name: error.name })
    }
    if (error instanceof InvalidCertificateError) {
      return reply
        .status(500)
        .send({ message: error.message, name: error.name })
    }
    if (error instanceof CancelNfceSefazError) {
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

export { cancelNfceController }
