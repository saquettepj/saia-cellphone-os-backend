import { UpdateSystemConfigUseCase } from '../updateSystemConfigUseCase'

import { SystemConfigRepository } from '@/repositories/systemConfig/systemConfigRepository'

function setupUpdateSystemConfigUseCase() {
  const systemConfigRepository = new SystemConfigRepository()
  const updateSystemConfigUseCase = new UpdateSystemConfigUseCase(
    systemConfigRepository,
  )

  return updateSystemConfigUseCase
}

export { setupUpdateSystemConfigUseCase }
