import { CreateNfceUseCase } from '../createNfceUseCase'

import { NfceRepository } from '@/repositories/nfce/nfceRepository'
import { NfeDataRepository } from '@/repositories/nfeData/nfeDataRepository'
import { CompanyRepository } from '@/repositories/company/companyRepository'
import { ClientRepository } from '@/repositories/client/clientRepository'
import { OrderRepository } from '@/repositories/order/orderRepository'
import { AddressRepository } from '@/repositories/address/addressRepository'

function setupCreateNfceUseCase() {
  const nfceRepository = new NfceRepository()
  const nfeDataRepository = new NfeDataRepository()
  const companyRepository = new CompanyRepository()
  const clientRepository = new ClientRepository()
  const addressRepository = new AddressRepository()
  const orderRepository = new OrderRepository()

  const createNfceUseCase = new CreateNfceUseCase(
    nfceRepository,
    nfeDataRepository,
    companyRepository,
    clientRepository,
    addressRepository,
    orderRepository,
  )

  return createNfceUseCase
}

export { setupCreateNfceUseCase }
