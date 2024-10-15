import { IAddressRepository } from '@/repositories/address/IAddressRepository'
import { ClientNotFoundError } from '@/errors/clientNotFoundError'
import { IClientRepository } from '@/repositories/client/IClientRepository'

interface ICreateAddressUseCaseRequest {
  city: string
  state: string
  neighborhood: string
  street: string
  streetNumber: string
  zipCode: string
  clientId?: string
  companyId: string
}

class CreateAddressUseCase {
  constructor(
    private addressRepository: IAddressRepository,
    private clientRepositoryRepository: IClientRepository,
  ) {}

  async execute({
    city,
    state,
    neighborhood,
    street,
    streetNumber,
    zipCode,
    clientId,
    companyId,
  }: ICreateAddressUseCaseRequest) {
    if (clientId) {
      const existingClient =
        await this.clientRepositoryRepository.findById(clientId)
      if (!existingClient) {
        throw new ClientNotFoundError()
      }
    }
    const createdAddress = await this.addressRepository.create({
      city,
      state,
      neighborhood,
      street,
      streetNumber,
      zipCode,
      clientId,
      companyId,
    })

    return createdAddress
  }
}

export { CreateAddressUseCase, ICreateAddressUseCaseRequest }
