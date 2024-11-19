import { CNPJAlreadyExistsError } from '@/errors/CNPJAlreadyExistsError'
import { EmailAlreadyExistsError } from '@/errors/emailAlreadyExistsError'
import { ISupplierRepository } from '@/repositories/supplier/ISupplierRepository'

interface IUpdateSupplierUseCaseRequest {
  companyId: string
  id: string
  name?: string
  CNPJ?: string
  CEP?: string
  email?: string
  phone?: string
}

class UpdateSupplierUseCase {
  constructor(private supplierRepository: ISupplierRepository) {}

  async execute({
    companyId,
    id,
    name,
    CNPJ,
    CEP,
    email,
    phone,
  }: IUpdateSupplierUseCaseRequest) {
    if (CNPJ) {
      const searchedSupplierByCNPJ =
        await this.supplierRepository.findByCNPJAndCompanyId(CNPJ, companyId)
      if (searchedSupplierByCNPJ) {
        throw new CNPJAlreadyExistsError()
      }
    }

    if (email) {
      const searchedSupplierByEmail =
        await this.supplierRepository.findByEmailAndCompanyId(email, companyId)
      if (searchedSupplierByEmail) {
        throw new EmailAlreadyExistsError()
      }
    }

    const updatedSupplier = await this.supplierRepository.updateById(id, {
      name,
      CNPJ,
      CEP,
      email,
      phone,
    })

    return updatedSupplier
  }
}

export { UpdateSupplierUseCase, IUpdateSupplierUseCaseRequest }
