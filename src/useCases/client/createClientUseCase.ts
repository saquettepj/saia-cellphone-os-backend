import { CPFAlreadyExistsError } from '@/errors/CPFAlreadyExistsError'
import { EmailAlreadyExistsError } from '@/errors/emailAlreadyExistsError'
import { IClientRepository } from '@/repositories/client/IClientRepository'

interface ICreateClientUseCaseRequest {
  name: string
  CPF: string
  email: string
  phone?: string
  address?: string
  companyId: string
}

class CreateClientUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute({
    name,
    CPF,
    email,
    phone,
    address,
    companyId,
  }: ICreateClientUseCaseRequest) {
    const searchedCPF = await this.clientRepository.findByCPF(CPF)

    if (searchedCPF) {
      throw new CPFAlreadyExistsError()
    }

    const searchedEmail = await this.clientRepository.findByEmail(email)

    if (searchedEmail) {
      throw new EmailAlreadyExistsError()
    }

    const result = await this.clientRepository.create({
      name,
      CPF,
      email,
      phone,
      address,
      companyId,
    })

    return result
  }
}

export { CreateClientUseCase, ICreateClientUseCaseRequest }
