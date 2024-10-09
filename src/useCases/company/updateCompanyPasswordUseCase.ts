import { compare, hash } from 'bcrypt'

import { CompanyCredentialsError } from '@/errors/companyCredentialsError'
import { ICompanyRepository } from '@/repositories/company/ICompanyRepository'
import { CompanyUpdatePasswordError } from '@/errors/companyUpdatePasswordError'
import { generateEmailUpdatePasswordObject } from '@/emails/emailStructures/generateEmailUpdatePasswordObject'
import { IEmailConfig } from '@/emails/IEmailConfig'
import { sendEmail } from '@/emails/sendEmail'

interface IUpdateCompanyPasswordUseCaseRequest {
  CNPJ: string
  password: string
  newPassword: string
}

class UpdateCompanyPasswordUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute({
    CNPJ,
    password,
    newPassword,
  }: IUpdateCompanyPasswordUseCaseRequest) {
    const searchedCompany = await this.companyRepository.findByCNPJ(CNPJ)

    if (!searchedCompany) {
      throw new CompanyCredentialsError()
    }

    const passwordMatch = await compare(password, searchedCompany.passwordHash)

    if (!passwordMatch) {
      throw new CompanyCredentialsError()
    }

    const passwordHash = await hash(newPassword.trim(), 8)

    await this.companyRepository.updatePasswordById(
      searchedCompany.id,
      passwordHash,
    )

    const confirmationEmailObject = generateEmailUpdatePasswordObject()

    const mailConfiguration: IEmailConfig = {
      to: searchedCompany.email,
      subject: confirmationEmailObject.subject,
      html: confirmationEmailObject.html,
    }

    await sendEmail(mailConfiguration).then().catch()

    if (searchedCompany.passwordHash === passwordHash) {
      throw new CompanyUpdatePasswordError()
    }
  }
}

export { UpdateCompanyPasswordUseCase, IUpdateCompanyPasswordUseCaseRequest }
