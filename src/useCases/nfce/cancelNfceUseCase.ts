/* eslint-disable @typescript-eslint/no-var-requires */
import { inspect } from 'util'

import { INfeDataRepository } from '@/repositories/nfeData/INfeDataRepository'
import { IOrderRepository } from '@/repositories/order/IOrderRepository'
import { buildCancelNfcePayload } from '@/utils/buildNfePayload'
import { decryptPassword } from '@/utils/cryptoUtils'
import { InvalidCertificateError } from '@/errors/invalidCertificateError'
import { SEFAZError } from '@/errors/SEFAZError'
import { InvoiceDataNotFoundError } from '@/errors/invoiceDataNotFoundError'
import { ICertificate } from '@/interfaces/ICertificate'
import { CancelNfceSefazError } from '@/errors/cancelNfceSefazError'

const { cancelar, carregaCertificadoBase64 } = require('node-nfe-nfce')

interface ICancelNfceUseCaseRequest {
  companyId: string
  orderId: string
  xJust: string
}

class CancelNfceUseCase {
  constructor(
    private nfeDataRepository: INfeDataRepository,
    private orderRepository: IOrderRepository,
  ) {}

  async execute({ companyId, orderId, xJust }: ICancelNfceUseCaseRequest) {
    const nfeData = await this.nfeDataRepository.findOneByCompanyId(companyId)
    const order = await this.orderRepository.findAllById(orderId)
    const chNFe = order?.nfce?.chNFe
    const nProt = order?.nfce?.nProt
    let cert: ICertificate

    if (!chNFe || !nProt) {
      throw new InvoiceDataNotFoundError()
    }

    if (nfeData && chNFe && nProt && xJust) {
      try {
        const password = decryptPassword(nfeData.certificatePasswordEncrypt)

        const keypem = carregaCertificadoBase64({
          base64: nfeData.serializedCertificatePFX,
          password,
        })

        cert = {
          pem: keypem.pem,
          key: keypem.key,
          password,
        }
      } catch (error) {
        throw new InvalidCertificateError()
      }

      try {
        const NfcePayload = buildCancelNfcePayload(nfeData, cert)

        const cancelNfceResponse = await cancelar({
          chNFe,
          nProt,
          xJust,
          configuracoes: NfcePayload?.configuracoes,
        })

        if (cancelNfceResponse?.success === false) {
          throw new CancelNfceSefazError(cancelNfceResponse?.mensagem || '')
        }
      } catch (error) {
        if (error instanceof CancelNfceSefazError) {
          throw error
        }

        throw new SEFAZError()
      }
    }
  }
}

export { CancelNfceUseCase, ICancelNfceUseCaseRequest }
