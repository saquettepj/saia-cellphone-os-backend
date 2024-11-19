import { ISupplierRepository } from '@/repositories/supplier/ISupplierRepository'

interface IDeleteSupplierUseCaseRequest {
  id: string
}

class DeleteSupplierUseCase {
  constructor(private supplierRepository: ISupplierRepository) {}

  async execute({ id }: IDeleteSupplierUseCaseRequest) {
    const deletedSupplier = await this.supplierRepository.delete(id)
    return deletedSupplier
  }
}

export { DeleteSupplierUseCase, IDeleteSupplierUseCaseRequest }
