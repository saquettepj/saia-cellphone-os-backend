import { CPFAlreadyExistsError } from '@/errors/CPFAlreadyExistsError'
import { EmailAlreadyExistsError } from '@/errors/emailAlreadyExistsError'
import { IClientRepository } from '@/repositories/client/IClientRepository'

interface IUpdateClientUseCaseRequest {
  id: string
  name?: string
  CPF?: string
  email?: string
  phone?: string
}

class UpdateClientUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute({ id, name, CPF, email, phone }: IUpdateClientUseCaseRequest) {
    if (CPF) {
      const searchedClientByCPF = await this.clientRepository.findByCPF(CPF)
      if (searchedClientByCPF) {
        throw new CPFAlreadyExistsError()
      }
    }

    if (email) {
      const searchedClientByEmail =
        await this.clientRepository.findByEmail(email)
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
