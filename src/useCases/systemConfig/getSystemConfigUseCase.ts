import { SystemConfigNotFoundError } from '@/errors/systemConfigNotFoundError'
import { ISystemConfigRepository } from '@/repositories/systemConfig/ISystemConfigRepository'

class GetSystemConfigUseCase {
  constructor(private systemConfigRepository: ISystemConfigRepository) {}

  async execute() {
    const systemConfig = await this.systemConfigRepository.get(
      'acd7e9de-75e8-40a9-8abd-26e5e00661aa',
    )

    if (!systemConfig) {
      throw new SystemConfigNotFoundError()
    }

    return systemConfig
  }
}

export { GetSystemConfigUseCase }
