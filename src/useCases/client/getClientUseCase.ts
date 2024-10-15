import { IClientRepository } from '@/repositories/client/IClientRepository'

interface IGetClientsUseCaseRequest {
  companyId: string
  name?: string
  CPF?: string
  email?: string
  phone?: string
}

class GetClientUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute({
    companyId,
    name,
    CPF,
    email,
    phone,
  }: IGetClientsUseCaseRequest) {
    const clients = await this.clientRepository.findAllByCompanyId(companyId, {
      companyId,
      name,
      CPF,
      email,
      phone,
    })
    return clients
  }
}

export { GetClientUseCase, IGetClientsUseCaseRequest }
