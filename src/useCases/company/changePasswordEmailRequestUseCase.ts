import { sign } from 'jsonwebtoken'

import { sendEmail } from '@/emails/sendEmail'
import { IEmailConfig } from '@/emails/IEmailConfig'
import { env } from '@/env'
import { ICompanyRepository } from '@/repositories/company/ICompanyRepository'
import { generateChangePasswordEmailObject } from '@/emails/emailStructures/generateChangePasswordEmailObject'
import { SendEmailError } from '@/errors/sendEmailError'

interface IChangePasswordEmailRequestUseCaseRequest {
  id: string
}

class ChangePasswordEmailRequestUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute({ id }: IChangePasswordEmailRequestUseCaseRequest) {
    const searchedCompany = await this.companyRepository.findById(id)

    if (!searchedCompany?.email) {
      throw new SendEmailError()
    }

    const token = sign({ id }, env.RESET_PASSWORD_TOKEN, {
      expiresIn: '10m',
    })

    const changePasswordEmailObject = generateChangePasswordEmailObject(token)

    const mailConfiguration: IEmailConfig = {
      to: searchedCompany.email,
      subject: changePasswordEmailObject.subject,
      html: changePasswordEmailObject.html,
    }

    await sendEmail(mailConfiguration)
      .then()
      .catch(() => {
        throw new SendEmailError()
      })
  }
}

export {
  ChangePasswordEmailRequestUseCase,
  IChangePasswordEmailRequestUseCaseRequest,
}
