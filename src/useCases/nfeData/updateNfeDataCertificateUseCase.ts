import { hash } from 'bcrypt'

import { INfeDataRepository } from '@/repositories/nfeData/INfeDataRepository'
import { NfeDataNotFoundError } from '@/errors/nfeDataNotFoundError'

interface IUpdateNfeDataCertificateUseCaseRequest {
  id: string
  certificateKey: string
  serializedCertificate: string
}

class UpdateNfeDataCertificateUseCase {
  constructor(private nfeDataRepository: INfeDataRepository) {}

  async execute({
    id,
    certificateKey,
    serializedCertificate,
  }: IUpdateNfeDataCertificateUseCaseRequest) {
    const existingNfeData = await this.nfeDataRepository.findById(id)

    if (!existingNfeData) {
      throw new NfeDataNotFoundError()
    }

    const certificateKeyHash = await hash(certificateKey.trim(), 8)

    const result = await this.nfeDataRepository.updateById(id, {
      certificateKey: certificateKeyHash,
      serializedCertificate,
    })

    return result
  }
}

export {
  UpdateNfeDataCertificateUseCase,
  IUpdateNfeDataCertificateUseCaseRequest,
}
