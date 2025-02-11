import { IClientRepository } from '@/repositories/client/IClientRepository'
import { CPFAlreadyExistsError } from '@/errors/CPFAlreadyExistsError'
import { EmailAlreadyExistsError } from '@/errors/emailAlreadyExistsError'

interface ICreateClientUseCaseRequest {
  name: string
  CPF: string
  email?: string | null
  phone?: string
  companyId: string
  address?: {
    country: string
    city: string
    state: string
    neighborhood: string
    street: string
    streetNumber: string
    zipCode: string
  }
}

class CreateClientUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute({
    name,
    CPF,
    email,
    phone,
    companyId,
    address,
  }: ICreateClientUseCaseRequest) {
    const searchedCPF = await this.clientRepository.findByCPFAndCompanyId(
      CPF,
      companyId,
    )

    if (searchedCPF) {
      throw new CPFAlreadyExistsError()
    }

    if (email) {
      const searchedEmail = await this.clientRepository.findByEmailAndCompanyId(
        email,
        companyId,
      )
      if (searchedEmail) {
        throw new EmailAlreadyExistsError()
      }
    }

    const newClient = await this.clientRepository.create({
      name,
      CPF,
      email,
      phone,
      companyId,
      address,
    })

    return newClient
  }
}

export { CreateClientUseCase, ICreateClientUseCaseRequest }
