import { verify } from 'jsonwebtoken'

import { env } from '@/env'
import { LinkExpiredError } from '@/errors/linkExpiredError'

interface IVerifyResetPasswordTokenUseCaseRequest {
  token?: string
}

class VerifyResetPasswordTokenUseCase {
  async execute({ token }: IVerifyResetPasswordTokenUseCaseRequest) {
    if (!token) {
      throw new LinkExpiredError()
    }

    try {
      verify(token, env.RESET_PASSWORD_TOKEN)
    } catch (error) {
      throw new LinkExpiredError()
    }
  }
}

export {
  VerifyResetPasswordTokenUseCase,
  IVerifyResetPasswordTokenUseCaseRequest,
}
