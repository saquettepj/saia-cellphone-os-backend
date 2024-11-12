import { IEmailConfig } from '@/emails/IEmailConfig'
import { generateEmailSendCodeObject } from '@/emails/emailStructures/generateEmailSendCodeObject'
import { sendEmail } from '@/emails/sendEmail'
import { EmailAlreadyConfirmedError } from '@/errors/emailAlreadyConfirmedError'
import { EmailNotFoundError } from '@/errors/emailNotFoundError'
import { ICompanyRepository } from '@/repositories/company/ICompanyRepository'
import { generateRandomNumber } from '@/utils/randomNumberGenerator'

interface ISendEmailConfirmationUseCaseRequest {
  id: string
}

class SendEmailConfirmationUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute({ id }: ISendEmailConfirmationUseCaseRequest) {
    const searchedCompany = await this.companyRepository.findById(id)

    if (searchedCompany?.emailChecked) {
      throw new EmailAlreadyConfirmedError()
    }

    if (!searchedCompany?.email) {
      throw new EmailNotFoundError()
    }

    const randomCode = generateRandomNumber(6)
    const confirmationEmailObject = generateEmailSendCodeObject(randomCode)

    await this.companyRepository.updateById(id, {
      emailConfirmationCode: randomCode,
    })

    const mailConfiguration: IEmailConfig = {
      to: searchedCompany.email,
      subject: confirmationEmailObject.subject,
      html: confirmationEmailObject.html,
    }

    await sendEmail(mailConfiguration).then().catch()
  }
}

export { SendEmailConfirmationUseCase }
