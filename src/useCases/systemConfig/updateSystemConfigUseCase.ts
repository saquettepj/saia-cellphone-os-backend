import { UpdatingError } from '@/errors/updatingError'
import { ISystemConfigRepository } from '@/repositories/systemConfig/ISystemConfigRepository'

interface IUpdateSystemConfigUseCaseRequest {
  terms?: string
  password: string
}

class UpdateSystemConfigUseCase {
  constructor(private systemConfigRepository: ISystemConfigRepository) {}

  async execute({ terms, password }: IUpdateSystemConfigUseCaseRequest) {
    if (!password || password !== process.env.ADMIN_UPDATE_PASSWORD) {
      throw new UpdatingError()
    }

    const updatedSystemConfig = await this.systemConfigRepository.update(
      'acd7e9de-75e8-40a9-8abd-26e5e00661aa',
      {
        ...(terms && { terms }),
        termsUpdateAt: new Date(),
      },
    )

    return updatedSystemConfig
  }
}

export { UpdateSystemConfigUseCase, IUpdateSystemConfigUseCaseRequest }
