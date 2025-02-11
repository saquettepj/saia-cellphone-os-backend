import { hash } from 'argon2'
import { verify } from 'jsonwebtoken'

import { ICompanyRepository } from '@/repositories/company/ICompanyRepository'
import { env } from '@/env'
import { NotFoundError } from '@/errors/notFoundError'
import { LinkExpiredError } from '@/errors/linkExpiredError'

interface IResetCompanyPasswordUseCaseRequest {
  token: string
}

class ResetCompanyPasswordUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute({ token }: IResetCompanyPasswordUseCaseRequest) {
    let decodedToken

    if (!token) {
      throw new NotFoundError()
    }

    try {
      decodedToken = verify(token, env.RESET_PASSWORD_TOKEN) as {
        id: string
        password: string
      }
    } catch (error) {
      throw new LinkExpiredError()
    }

    if (!decodedToken?.id || !decodedToken?.password) {
      throw new NotFoundError()
    }

    const searchedCompany = this.companyRepository.findById(decodedToken.id)

    if (!searchedCompany) {
      throw new NotFoundError()
    }

    const hashedPassword = await hash(decodedToken.password.trim())

    await this.companyRepository.updatePasswordById(
      decodedToken.id,
      hashedPassword,
    )
  }
}

export { ResetCompanyPasswordUseCase, IResetCompanyPasswordUseCaseRequest }
