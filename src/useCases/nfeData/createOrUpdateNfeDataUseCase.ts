import { INfeDataRepository } from '@/repositories/nfeData/INfeDataRepository'
import { decryptPassword, encryptPassword } from '@/utils/cryptoUtils'

interface ICreateOrUpdateNfeDataUseCaseRequest {
  companyId: string
  serializedCertificatePFX: string
  certificatePassword: string
  idCSC: string
  CSC: string
  IE: string
  IM: string
  lastNNF: string
}

interface ICreateOrUpdateNfeDataUseCaseResponse {
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

class CreateOrUpdateNfeDataUseCase {
  constructor(private nfeDataRepository: INfeDataRepository) {}

  async execute({
    companyId,
    serializedCertificatePFX,
    certificatePassword,
    idCSC,
    CSC,
    IE,
    IM,
    lastNNF,
  }: ICreateOrUpdateNfeDataUseCaseRequest): Promise<ICreateOrUpdateNfeDataUseCaseResponse> {
    const encryptedPassword = encryptPassword(certificatePassword)

    const existingNfeData =
      await this.nfeDataRepository.findOneByCompanyId(companyId)

    if (existingNfeData) {
      const updatedNfeData = await this.nfeDataRepository.updateByCompanyId(
        companyId,
        {
          serializedCertificatePFX,
          certificatePasswordEncrypt: encryptedPassword,
          idCSC,
          CSC,
          IE,
          IM,
          lastNNF,
        },
      )

      return {
        id: updatedNfeData.id,
        companyId: updatedNfeData.companyId,
        serializedCertificatePFX: updatedNfeData.serializedCertificatePFX,
        certificatePasswordEncrypt: updatedNfeData.certificatePasswordEncrypt,
        idCSC: updatedNfeData.idCSC,
        CSC: updatedNfeData.CSC,
        IE: updatedNfeData.IE,
        IM: updatedNfeData.IM,
        lastNNF: updatedNfeData.lastNNF,
      }
    } else {
      const newNfeData = await this.nfeDataRepository.create({
        companyId,
        serializedCertificatePFX,
        certificatePasswordEncrypt: encryptedPassword,
        idCSC,
        CSC,
        IE,
        IM,
        lastNNF,
      })

      return {
        id: newNfeData.id,
        companyId: newNfeData.companyId,
        serializedCertificatePFX: newNfeData.serializedCertificatePFX,
        certificatePasswordEncrypt: newNfeData.certificatePasswordEncrypt,
        idCSC: newNfeData.idCSC,
        CSC: newNfeData.CSC,
        IE: newNfeData.IE,
        IM: newNfeData.IM,
        lastNNF: newNfeData.lastNNF,
      }
    }
  }

  decryptPassword(encryptedPassword: string): string {
    return decryptPassword(encryptedPassword)
  }
}

export {
  CreateOrUpdateNfeDataUseCase,
  ICreateOrUpdateNfeDataUseCaseRequest,
  ICreateOrUpdateNfeDataUseCaseResponse,
}
