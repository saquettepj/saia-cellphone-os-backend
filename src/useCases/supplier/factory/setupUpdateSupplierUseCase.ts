import { UpdateSupplierUseCase } from '../updateSupplierUseCase'

import { SupplierRepository } from '@/repositories/supplier/supplierRepository'

function setupUpdateSupplierUseCase() {
  const supplierRepository = new SupplierRepository()
  const updateSupplierUseCase = new UpdateSupplierUseCase(supplierRepository)

  return updateSupplierUseCase
}

export { setupUpdateSupplierUseCase }
