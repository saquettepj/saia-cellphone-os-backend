import { CreateSupplierUseCase } from '../createSupplierUseCase'

import { SupplierRepository } from '@/repositories/supplier/supplierRepository'

function setupCreateSupplierUseCase() {
  const supplierRepository = new SupplierRepository()
  const createSupplierUseCase = new CreateSupplierUseCase(supplierRepository)

  return createSupplierUseCase
}

export { setupCreateSupplierUseCase }
