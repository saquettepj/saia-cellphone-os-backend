import { CPFAlreadyExistsError } from '@/errors/CPFAlreadyExistsError'
import { EmailAlreadyExistsError } from '@/errors/emailAlreadyExistsError'
import { IClientRepository } from '@/repositories/client/IClientRepository'

interface IUpdateClientUseCaseRequest {
  companyId: string
  id: string
  name?: string
  CPF?: string
  email?: string
  phone?: string
}

class UpdateClientUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute({
    companyId,
    id,
    name,
    CPF,
    email,
    phone,
  }: IUpdateClientUseCaseRequest) {
    if (CPF) {
      const searchedClientByCPF =
        await this.clientRepository.findByCPFAndCompanyId(CPF, companyId)
      if (searchedClientByCPF) {
        throw new CPFAlreadyExistsError()
      }
    }

    if (email) {
      const searchedClientByEmail =
        await this.clientRepository.findByEmailAndCompanyId(email, companyId)
      if (searchedClientByEmail) {
        throw new EmailAlreadyExistsError()
      }
    }

    const updatedClient = await this.clientRepository.updateById(id, {
      name,
      CPF,
      email,
      phone,
    })

    return updatedClient
  }
}

export { UpdateClientUseCase, IUpdateClientUseCaseRequest }
