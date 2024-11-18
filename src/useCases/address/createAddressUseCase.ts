import { IAddressRepository } from '@/repositories/address/IAddressRepository'
import { ClientNotFoundError } from '@/errors/clientNotFoundError'
import { IClientRepository } from '@/repositories/client/IClientRepository'
import { ClientHasAddressError } from '@/errors/clientHasAddressError'
import { CompanyHasAddressError } from '@/errors/companyHasAddressError'

interface ICreateAddressUseCaseRequest {
  country: string
  city: string
  state: string
  neighborhood: string
  street: string
  streetNumber: string
  zipCode: string
  companyId: string
  clientId?: string
}

class CreateAddressUseCase {
  constructor(
    private addressRepository: IAddressRepository,
    private clientRepositoryRepository: IClientRepository,
  ) {}

  async execute({
    country,
    city,
    state,
    neighborhood,
    street,
    streetNumber,
    zipCode,
    clientId,
    companyId,
  }: ICreateAddressUseCaseRequest) {
    if (clientId || clientId != null) {
      const existingClient =
        await this.clientRepositoryRepository.findById(clientId)
      if (!existingClient) {
        throw new ClientNotFoundError()
      }

      const existingClientAddress =
        await this.addressRepository.findByClientId(clientId)
      if (existingClientAddress) {
        throw new ClientHasAddressError()
      }
    } else {
      const existingCompanyAddress =
        await this.addressRepository.findByCompanyId(companyId)
      if (existingCompanyAddress) {
        throw new CompanyHasAddressError()
      }
    }
    const createdAddress = await this.addressRepository.create({
      country,
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
