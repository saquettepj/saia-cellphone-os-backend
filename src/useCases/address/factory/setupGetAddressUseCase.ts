import { GetAddressUseCase } from '@/useCases/address/getAddressUseCase'
import { AddressRepository } from '@/repositories/address/addressRepository'

export const setupGetAddressUseCase = () => {
  const addressRepository = new AddressRepository()
  return new GetAddressUseCase(addressRepository)
}
