import { env } from '@/env'
import { SystemConfigNotFoundError } from '@/errors/systemConfigNotFoundError'
import { ISystemConfigRepository } from '@/repositories/systemConfig/ISystemConfigRepository'

class GetSystemConfigUseCase {
  constructor(private systemConfigRepository: ISystemConfigRepository) {}

  async execute() {
    const systemConfig = await this.systemConfigRepository.get(env.SYSTEM_ID)

    if (!systemConfig) {
      throw new SystemConfigNotFoundError()
    }

    return systemConfig
  }
}

export { GetSystemConfigUseCase }
