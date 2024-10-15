import { DeleteAddressUseCase } from '@/useCases/address/deleteAddressUseCase'
import { AddressRepository } from '@/repositories/address/addressRepository'

export const setupDeleteAddressUseCase = () => {
  const addressRepository = new AddressRepository()
  return new DeleteAddressUseCase(addressRepository)
}
