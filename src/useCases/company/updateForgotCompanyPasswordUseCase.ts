import { sign } from 'jsonwebtoken'

import { ICompanyRepository } from '@/repositories/company/ICompanyRepository'
import { CompanyCredentialsForgotPasswordError } from '@/errors/companyCredentialsForgotPasswordError'
import { sendEmail } from '@/emails/sendEmail'
import { IEmailConfig } from '@/emails/IEmailConfig'
import { env } from '@/env'
import { generateEmailResetPasswordObject } from '@/emails/emailStructures/generateEmailResetPasswordObject'
import { randomPasswordGenerator } from '@/utils/randomPasswordGenerator'

interface IUpdateForgotCompanyPasswordUseCaseRequest {
  CNPJ: string
  email: string
}

class UpdateForgotCompanyPasswordUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute({ CNPJ, email }: IUpdateForgotCompanyPasswordUseCaseRequest) {
    const searchedCompany = await this.companyRepository.findByCNPJ(CNPJ)

    if (!searchedCompany) {
      throw new CompanyCredentialsForgotPasswordError()
    }

    if (searchedCompany.email !== email) {
      throw new CompanyCredentialsForgotPasswordError()
    }

    const newPassword = randomPasswordGenerator()

    const token = sign(
      { id: searchedCompany.id, password: newPassword },
      env.RESET_PASSWORD_TOKEN,
      {
        expiresIn: '10m',
      },
    )

    const resetPasswordEmailObject = generateEmailResetPasswordObject(
      token,
      newPassword,
    )

    const mailConfiguration: IEmailConfig = {
      to: searchedCompany.email,
      subject: resetPasswordEmailObject.subject,
      html: resetPasswordEmailObject.html,
    }

    await sendEmail(mailConfiguration).then().catch()

    return searchedCompany
  }
}

export {
  UpdateForgotCompanyPasswordUseCase,
  IUpdateForgotCompanyPasswordUseCaseRequest,
}
