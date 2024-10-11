import { UpdateNfeDataCertificateUseCase } from '../updateNfeDataCertificateUseCase'

import { NfeDataRepository } from '@/repositories/nfeData/nfeDataRepository'

function setupUpdateNfeDataCertificateUseCase() {
  const nfeDataRepository = new NfeDataRepository()
  const updateNfeDataCertificateUseCase = new UpdateNfeDataCertificateUseCase(
    nfeDataRepository,
  )

  return updateNfeDataCertificateUseCase
}

export { setupUpdateNfeDataCertificateUseCase }
