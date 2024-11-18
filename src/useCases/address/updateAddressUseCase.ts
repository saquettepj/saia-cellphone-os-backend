import { IAddressRepository } from '@/repositories/address/IAddressRepository'
import { AddressNotFoundError } from '@/errors/addressNotFoundError'
import { ClientNotFoundError } from '@/errors/clientNotFoundError'
import { IClientRepository } from '@/repositories/client/IClientRepository'

interface IUpdateAddressUseCaseRequest {
  country?: string
  city?: string
  state?: string
  neighborhood?: string
  street?: string
  streetNumber?: string
  zipCode?: string
  clientId?: string
  companyId: string
}

class UpdateAddressUseCase {
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
  }: IUpdateAddressUseCaseRequest) {
    if (clientId || clientId != null) {
      const existingClient =
        await this.clientRepositoryRepository.findById(clientId)
      if (!existingClient) {
        throw new ClientNotFoundError()
      }

      const existingAddress =
        await this.addressRepository.findByClientId(clientId)
      if (!existingAddress) {
        throw new AddressNotFoundError()
      }

      if (existingAddress.clientId === null) {
        throw new AddressNotFoundError()
      }

      const updatedAddress = await this.addressRepository.updateByClientId(
        clientId,
        {
          country,
          city,
          state,
          neighborhood,
          street,
          streetNumber,
          zipCode,
        },
      )

      return updatedAddress
    } else {
      const existingAddress =
        await this.addressRepository.findByCompanyId(companyId)
      if (!existingAddress) {
        throw new AddressNotFoundError()
      }

      const updatedAddress = await this.addressRepository.updateByCompanyId(
        companyId,
        {
          country,
          city,
          state,
          neighborhood,
          street,
          streetNumber,
          zipCode,
        },
      )

      console.log(updatedAddress)

      return updatedAddress
    }
  }
}

export { UpdateAddressUseCase, IUpdateAddressUseCaseRequest }
