import { GetSupplierUseCase } from '../getSupplierUseCase'

import { SupplierRepository } from '@/repositories/supplier/supplierRepository'

function setupGetSupplierUseCase() {
  const supplierRepository = new SupplierRepository()
  const getSupplierUseCase = new GetSupplierUseCase(supplierRepository)

  return getSupplierUseCase
}

export { setupGetSupplierUseCase }
