import { NfeConfigurationNotFoundError } from '@/errors/nfeConfigurationNotFoundError'
import { INfeDataRepository } from '@/repositories/nfeData/INfeDataRepository'

interface IGetNfeDataUseCaseRequest {
  companyId: string
}

interface IGetNfeDataUseCaseResponse {
  id: string
  companyId: string
  serializedCertificatePFX: string
  certificatePasswordEncrypt: string
  idCSC: string
  CSC: string
  IE: string
  IM: string
  lastNNF: string
}

class GetNfeDataUseCase {
  constructor(private nfeDataRepository: INfeDataRepository) {}

  async execute({
    companyId,
  }: IGetNfeDataUseCaseRequest): Promise<IGetNfeDataUseCaseResponse> {
    const nfeData = await this.nfeDataRepository.findOneByCompanyId(companyId)

    if (!nfeData) {
      throw new NfeConfigurationNotFoundError()
    }

    return {
      id: nfeData.id,
      companyId: nfeData.companyId,
      serializedCertificatePFX: nfeData.serializedCertificatePFX,
      certificatePasswordEncrypt: nfeData.certificatePasswordEncrypt,
      idCSC: nfeData.idCSC,
      CSC: nfeData.CSC,
      IE: nfeData.IE,
      IM: nfeData.IM,
      lastNNF: nfeData.lastNNF,
    }
  }
}

export {
  GetNfeDataUseCase,
  IGetNfeDataUseCaseRequest,
  IGetNfeDataUseCaseResponse,
}
