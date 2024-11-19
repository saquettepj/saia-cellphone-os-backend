import { AddressRepository } from '@/repositories/address/addressRepository'
import { ClientRepository } from '@/repositories/client/clientRepository'
import { CreateAddressUseCase } from '@/useCases/address/createAddressUseCase'

export const setupCreateAddressUseCase = () => {
  const addressRepository = new AddressRepository()
  const clientRepository = new ClientRepository()

  return new CreateAddressUseCase(addressRepository, clientRepository)
}
