import { hash } from 'bcrypt'
import { verify } from 'jsonwebtoken'

import { ICompanyRepository } from '@/repositories/company/ICompanyRepository'
import { env } from '@/env'
import { NotFoundError } from '@/errors/notFoundError'
import { LinkExpiredError } from '@/errors/linkExpiredError'

interface IResetCompanyPasswordUseCaseRequest {
  token: string
  newPassword: string
}

class ResetCompanyPasswordUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute({ token, newPassword }: IResetCompanyPasswordUseCaseRequest) {
    let decodedToken

    if (!newPassword || !token) {
      throw new NotFoundError()
    }

    try {
      decodedToken = verify(token, env.RESET_PASSWORD_TOKEN) as {
        id: string
      }
    } catch (error) {
      throw new LinkExpiredError()
    }

    if (!decodedToken?.id) {
      throw new NotFoundError()
    }

    const searchedCompany = this.companyRepository.findById(decodedToken.id)

    if (!searchedCompany) {
      throw new NotFoundError()
    }

    const hashedPassword = await hash(newPassword.trim(), 8)

    await this.companyRepository.updatePasswordById(
      decodedToken.id,
      hashedPassword,
    )
  }
}

export { ResetCompanyPasswordUseCase, IResetCompanyPasswordUseCaseRequest }
