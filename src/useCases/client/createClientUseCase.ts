import { IClientRepository } from '@/repositories/client/IClientRepository'
import { CPFAlreadyExistsError } from '@/errors/CPFAlreadyExistsError'
import { EmailAlreadyExistsError } from '@/errors/emailAlreadyExistsError'

interface ICreateClientUseCaseRequest {
  name: string
  CPF: string
  email: string
  phone?: string
  companyId: string
}

class CreateClientUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute({
    name,
    CPF,
    email,
    phone,
    companyId,
  }: ICreateClientUseCaseRequest) {
    const searchedCPF = await this.clientRepository.findByCPFAndCompanyId(
      CPF,
      companyId,
    )

    if (searchedCPF) {
      throw new CPFAlreadyExistsError()
    }

    const searchedEmail = await this.clientRepository.findByEmailAndCompanyId(
      email,
      companyId,
    )
    if (searchedEmail) {
      throw new EmailAlreadyExistsError()
    }

    const newClient = await this.clientRepository.create({
      name,
      CPF,
      email,
      phone,
      companyId,
    })

    return newClient
  }
}

export { CreateClientUseCase, ICreateClientUseCaseRequest }
