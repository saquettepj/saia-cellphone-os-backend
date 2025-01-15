import { generateSupportEmailByClient } from '@/emails/emailStructures/generateSupportEmailByClient'
import { IEmailConfig } from '@/emails/IEmailConfig'
import { sendEmail } from '@/emails/sendEmail'
import { env } from '@/env'
import { SendEmailError } from '@/errors/sendEmailError'
import { ICompanyRepository } from '@/repositories/company/ICompanyRepository'

interface ISendSupportEmailUseCaseRequest {
  id: string
  text: string
}

class SendSupportEmailUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute({ id, text }: ISendSupportEmailUseCaseRequest) {
    const searchedCompany = await this.companyRepository.findById(id)

    const confirmationEmailObject = generateSupportEmailByClient(
      text,
      searchedCompany?.CNPJ || '',
      searchedCompany?.name || '',
      searchedCompany?.email || '',
    )

    const mailConfiguration: IEmailConfig = {
      to: env.SUPPORT_EMAIL_USER,
      subject: confirmationEmailObject.subject,
      html: confirmationEmailObject.html,
    }

    await sendEmail(mailConfiguration)
      .then()
      .catch(() => {
        throw new SendEmailError()
      })
  }
}

export { SendSupportEmailUseCase }
