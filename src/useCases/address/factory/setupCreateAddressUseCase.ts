import { AddressRepository } from '@/repositories/address/addressRepository'
import { ClientRepository } from '@/repositories/client/clientRepository'
import { CompanyRepository } from '@/repositories/company/companyRepository'
import { CreateAddressUseCase } from '@/useCases/address/createAddressUseCase'

export const setupCreateAddressUseCase = () => {
  const addressRepository = new AddressRepository()
  const clientRepository = new ClientRepository()
  const companyRepository = new CompanyRepository()

  return new CreateAddressUseCase(
    addressRepository,
    clientRepository,
    companyRepository,
  )
}
