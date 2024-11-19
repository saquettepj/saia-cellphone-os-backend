import { ISupplierRepository } from '@/repositories/supplier/ISupplierRepository'

interface IGetSuppliersUseCaseRequest {
  companyId: string
  name?: string
  CNPJ?: string
  CEP?: string
  email?: string
  phone?: string
}

class GetSupplierUseCase {
  constructor(private supplierRepository: ISupplierRepository) {}

  async execute({
    companyId,
    name,
    CNPJ,
    CEP,
    email,
    phone,
  }: IGetSuppliersUseCaseRequest) {
    const suppliers = await this.supplierRepository.findAllByCompanyId(
      companyId,
      {
        companyId,
        name,
        CNPJ,
        CEP,
        email,
        phone,
      },
    )
    return suppliers
  }
}

export { GetSupplierUseCase, IGetSuppliersUseCaseRequest }
