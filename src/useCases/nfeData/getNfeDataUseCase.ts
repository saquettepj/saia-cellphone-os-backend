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
}

class GetNfeDataUseCase {
  constructor(private nfeDataRepository: INfeDataRepository) {}

  async execute({
    companyId,
  }: IGetNfeDataUseCaseRequest): Promise<IGetNfeDataUseCaseResponse> {
    const nfeData = await this.nfeDataRepository.findOneByCompanyId(companyId)

    if (!nfeData) {
      throw new Error('Nenhuma configuração de NF-e encontrada para a empresa.')
    }

    return {
      id: nfeData.id,
      companyId: nfeData.companyId,
      serializedCertificatePFX: nfeData.serializedCertificatePFX,
      certificatePasswordEncrypt: nfeData.certificatePasswordEncrypt,
      idCSC: nfeData.idCSC,
      CSC: nfeData.CSC,
    }
  }
}

export {
  GetNfeDataUseCase,
  IGetNfeDataUseCaseRequest,
  IGetNfeDataUseCaseResponse,
}
