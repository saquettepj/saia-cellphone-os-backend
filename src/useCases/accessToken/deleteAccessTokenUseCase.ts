import { DeletingError } from '@/errors/deletingError'
import { IAccessTokenRepository } from '@/repositories/accessToken/IAccessTokenRepository'

interface IDeleteAccessTokenUseCaseRequest {
  id: string
}

class DeleteAccessTokenUseCase {
  constructor(private accessTokenRepository: IAccessTokenRepository) {}

  async execute({ id }: IDeleteAccessTokenUseCaseRequest) {
    const accessToken = await this.accessTokenRepository.findById(id)

    if (!accessToken) {
      throw new DeletingError()
    }

    await this.accessTokenRepository.delete(id)
  }
}

export { DeleteAccessTokenUseCase, IDeleteAccessTokenUseCaseRequest }
