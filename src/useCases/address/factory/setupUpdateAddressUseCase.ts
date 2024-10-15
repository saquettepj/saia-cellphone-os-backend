import { UpdateAddressUseCase } from '@/useCases/address/updateAddressUseCase'
import { AddressRepository } from '@/repositories/address/addressRepository'
import { ClientRepository } from '@/repositories/client/clientRepository'

export const setupUpdateAddressUseCase = () => {
  const addressRepository = new AddressRepository()
  const clientRepository = new ClientRepository()
  return new UpdateAddressUseCase(addressRepository, clientRepository)
}
