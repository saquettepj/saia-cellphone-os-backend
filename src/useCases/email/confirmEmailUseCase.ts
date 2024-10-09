import { EmailAlreadyConfirmedError } from '@/errors/emailAlreadyConfirmedError'
import { InvalidEmailConfirmationCodeError } from '@/errors/invalidEmailConfirmationCodeError'
import { ICompanyRepository } from '@/repositories/company/ICompanyRepository'

interface IConfirmEmailUseCaseRequest {
  id: string
  emailConfirmationCode: number
}

class ConfirmEmailUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute({ id, emailConfirmationCode }: IConfirmEmailUseCaseRequest) {
    const searchedCompany = await this.companyRepository.findById(id)

    if (searchedCompany?.emailChecked) {
      throw new EmailAlreadyConfirmedError()
    }

    if (searchedCompany?.emailConfirmationCode !== emailConfirmationCode) {
      throw new InvalidEmailConfirmationCodeError()
    }

    await this.companyRepository.updateById(id, {
      emailChecked: true,
      emailConfirmationCode: null,
    })
  }
}

export { ConfirmEmailUseCase }
