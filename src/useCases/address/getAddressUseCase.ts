import { IAddressRepository } from '@/repositories/address/IAddressRepository'
import { AddressNotFoundError } from '@/errors/addressNotFoundError'

interface IGetAddressUseCaseRequest {
  companyId: string
  clientId?: string
}

class GetAddressUseCase {
  constructor(private addressRepository: IAddressRepository) {}

  async execute({ companyId, clientId }: IGetAddressUseCaseRequest) {
    let searchedAddress

    if (clientId) {
      searchedAddress = await this.addressRepository.findByClientId(clientId)
    } else {
      searchedAddress = await this.addressRepository.findByCompanyId(companyId)
    }

    if (!searchedAddress) {
      throw new AddressNotFoundError()
    }

    return searchedAddress
  }
}

export { GetAddressUseCase, IGetAddressUseCaseRequest }
