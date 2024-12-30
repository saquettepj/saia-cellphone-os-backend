import { GetSystemConfigUseCase } from '../getSystemConfigUseCase'

import { SystemConfigRepository } from '@/repositories/systemConfig/systemConfigRepository'

function setupGetSystemConfigUseCase() {
  const systemConfigRepository = new SystemConfigRepository()
  const getSystemConfigUseCase = new GetSystemConfigUseCase(
    systemConfigRepository,
  )

  return getSystemConfigUseCase
}

export { setupGetSystemConfigUseCase }
