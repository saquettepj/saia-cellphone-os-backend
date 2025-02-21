/* eslint-disable @typescript-eslint/no-var-requires */
import { IClientRepository } from '@/repositories/client/IClientRepository'
import { ICompanyRepository } from '@/repositories/company/ICompanyRepository'
import { INfceRepository } from '@/repositories/nfce/INfceRepository'
import { INfeDataRepository } from '@/repositories/nfeData/INfeDataRepository'
import { IOrderRepository } from '@/repositories/order/IOrderRepository'
import { CNPJDataNotFoundError } from '@/errors/CNPJDataNotFoundError'
import { IAddressRepository } from '@/repositories/address/IAddressRepository'
import { ClientAddressNotFoundError } from '@/errors/clientAddressNotFoundError'
import { IExternalCNPJData } from '@/interfaces/IExternalCNPJData'
import { IMunicipio } from '@/interfaces/IMunicipio'
import { decryptPassword } from '@/utils/cryptoUtils'
import { InvalidCertificateError } from '@/errors/invalidCertificateError'
import { ClientNotFoundError } from '@/errors/clientNotFoundError'
import { SEFAZError } from '@/errors/SEFAZError'
import { buildNfcePayload } from '@/utils/buildNfePayload'
import { ICertificate } from '@/interfaces/ICertificate'
import { SendNfceSefazError } from '@/errors/sendNfceSefazError'
import { OrderAlreadyHasInvoiceError } from '@/errors/orderAlreadyHasInvoiceError'
import { IBucketRepository } from '@/repositories/bucket/IBucketRepository'

const { emitir, carregaCertificadoBase64 } = require('node-nfe-nfce')

interface ICreateNfceUseCaseRequest {
  companyId: string
  orderId: string
  cEANDisabled?: boolean
}

class CreateNfceUseCase {
  constructor(
    private nfceRepository: INfceRepository,
    private nfeDataRepository: INfeDataRepository,
    private companyRepository: ICompanyRepository,
    private clientRepository: IClientRepository,
    private addressRepository: IAddressRepository,
    private orderRepository: IOrderRepository,
    private bucketRepository: IBucketRepository,
  ) {}

  async execute({
    companyId,
    orderId,
    cEANDisabled,
  }: ICreateNfceUseCaseRequest) {
    const nfce = await this.nfceRepository.findOneByOrderId(orderId)
    const nfeData = await this.nfeDataRepository.findOneByCompanyId(companyId)
    const company = await this.companyRepository.findById(companyId)
    const order = await this.orderRepository.findAllById(orderId)

    if (!order?.clientId) {
      throw new ClientNotFoundError()
    }

    const client = await this.clientRepository.findById(order?.clientId)

    if (!client) {
      throw new ClientNotFoundError()
    }

    const clientAddress = await this.addressRepository.findByClientId(
      order?.clientId,
    )

    let municipality: IMunicipio | undefined
    let cert: ICertificate

    if (!clientAddress) {
      throw new ClientAddressNotFoundError()
    }

    try {
      const externalAddressResponse = await fetch(
        'https://servicodados.ibge.gov.br/api/v1/localidades/municipios',
      )
      const externalAddressResponseData: IMunicipio[] =
        await externalAddressResponse.json()

      municipality = externalAddressResponseData.find(
        (m) =>
          m.nome.toLowerCase() === clientAddress.city.toLowerCase() &&
          m.microrregiao.mesorregiao.UF.sigla ===
            clientAddress.state.toUpperCase(),
      )

      if (!municipality?.id) {
        throw new ClientAddressNotFoundError()
      }
    } catch (error) {
      throw new ClientAddressNotFoundError()
    }

    if (nfce && nfce !== null) {
      throw new OrderAlreadyHasInvoiceError()
    }

    if (
      nfeData &&
      company &&
      client &&
      order &&
      clientAddress &&
      client &&
      municipality
    ) {
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
        const externalCNPJResponse = await fetch(
          `https://open.cnpja.com/office/${company.CNPJ}`,
        )

        if (!externalCNPJResponse) {
          throw new CNPJDataNotFoundError()
        }

        const externalCNPJResponseData: IExternalCNPJData =
          await externalCNPJResponse.json()

        const NfcePayload = buildNfcePayload(
          externalCNPJResponseData,
          nfeData,
          client,
          clientAddress,
          order,
          municipality.id.toString(),
          cert,
          cEANDisabled,
        )

        const sendNfceResponse = await emitir(NfcePayload)

        if (
          sendNfceResponse?.success === false ||
          !sendNfceResponse?.nfeProc?.protNFe?.infProt?.chNFe ||
          !sendNfceResponse?.nfeProc?.protNFe?.infProt?.nProt ||
          !sendNfceResponse?.xml_completo
        ) {
          throw new SendNfceSefazError(sendNfceResponse?.mensagem || '')
        }

        const lastNNFInt = Number(nfeData.lastNNF)
        const nextNNF = lastNNFInt + 1
        const fileName = `${company.CNPJ}_${nextNNF}.xml`

        await this.bucketRepository.create(
          fileName,
          sendNfceResponse.xml_completo,
        )

        const createdNfce = await this.nfceRepository.create({
          companyId,
          clientId: order.clientId,
          orderId,
          chNFe: sendNfceResponse.nfeProc.protNFe.infProt.chNFe,
          nProt: sendNfceResponse.nfeProc.protNFe.infProt.nProt,
          number: nextNNF.toString(),
        })

        if (createdNfce.number) {
          await this.nfeDataRepository.updateByCompanyId(companyId, {
            lastNNF: createdNfce.number,
          })
        }

        return createdNfce
      } catch (error) {
        if (error instanceof CNPJDataNotFoundError) {
          throw error
        }

        if (error instanceof SendNfceSefazError) {
          throw error
        }

        throw new SEFAZError()
      }
    }
  }
}

export { CreateNfceUseCase, ICreateNfceUseCaseRequest }
