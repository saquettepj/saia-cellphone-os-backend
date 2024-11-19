import { DeleteSupplierUseCase } from '../deleteSupplierUseCase'

import { SupplierRepository } from '@/repositories/supplier/supplierRepository'

function setupDeleteSupplierUseCase() {
  const supplierRepository = new SupplierRepository()
  const deleteSupplierUseCase = new DeleteSupplierUseCase(supplierRepository)

  return deleteSupplierUseCase
}

export { setupDeleteSupplierUseCase }
