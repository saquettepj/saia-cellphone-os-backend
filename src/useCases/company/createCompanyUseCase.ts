import { hash } from 'bcrypt'

import { generateRandomNumber } from '@/utils/randomNumberGenerator'
import { generateEmailSendCodeObject } from '@/emails/emailStructures/generateEmailSendCodeObject'
import { IEmailConfig } from '@/emails/IEmailConfig'
import { sendEmail } from '@/emails/sendEmail'
import { ICompanyRepository } from '@/repositories/company/ICompanyRepository'
import { CompanyCNPJAlreadyExistsError } from '@/errors/companyCNPJAlreadyExistsError'
import { PasswordConfirmationIsDifferentError } from '@/errors/passwordConfirmationIsDifferentError'
import { EmailAlreadyExistsError } from '@/errors/emailAlreadyExistsError'

interface ICreateCompanyUseCaseRequest {
  CNPJ: string
  email: string
  name: string
  CEP: string
  password: string
  passwordConfirmation: string
}

class CreateCompanyUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute({
    CNPJ,
    email,
    name,
    CEP,
    password,
    passwordConfirmation,
  }: ICreateCompanyUseCaseRequest) {
    if (!(password === passwordConfirmation)) {
      throw new PasswordConfirmationIsDifferentError()
    }

    const searchedCNPJ = await this.companyRepository.findByCNPJ(CNPJ)

    if (searchedCNPJ) {
      throw new CompanyCNPJAlreadyExistsError()
    }

    const searchedEmail = await this.companyRepository.findByEmail(email)

    if (searchedEmail) {
      throw new EmailAlreadyExistsError()
    }

    const emailConfirmationCode = generateRandomNumber(6)
    const passwordHash = await hash(password.trim(), 8)

    const result = await this.companyRepository.create({
      CNPJ,
      email,
      emailConfirmationCode,
      name,
      CEP,
      passwordHash,
    })

    const confirmationEmailObject = generateEmailSendCodeObject(
      emailConfirmationCode,
    )

    const mailConfiguration: IEmailConfig = {
      to: email,
      subject: confirmationEmailObject.subject,
      html: confirmationEmailObject.html,
    }

    await sendEmail(mailConfiguration).then().catch()

    return result
  }
}

export { CreateCompanyUseCase, ICreateCompanyUseCaseRequest }
