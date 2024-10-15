import { IAddressRepository } from '@/repositories/address/IAddressRepository'
import { AddressNotFoundError } from '@/errors/addressNotFoundError'

class DeleteAddressUseCase {
  constructor(private addressRepository: IAddressRepository) {}

  async execute(id: string) {
    const address = await this.addressRepository.findById(id)

    if (!address) {
      throw new AddressNotFoundError()
    }

    await this.addressRepository.delete(id)
  }
}

export { DeleteAddressUseCase }
