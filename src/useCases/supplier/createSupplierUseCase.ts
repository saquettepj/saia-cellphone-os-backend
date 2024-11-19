import { ISupplierRepository } from '@/repositories/supplier/ISupplierRepository'
import { CNPJAlreadyExistsError } from '@/errors/CNPJAlreadyExistsError'
import { EmailAlreadyExistsError } from '@/errors/emailAlreadyExistsError'

interface ICreateSupplierUseCaseRequest {
  name: string
  CNPJ: string
  CEP: string
  email?: string
  phone?: string
  companyId: string
}

class CreateSupplierUseCase {
  constructor(private supplierRepository: ISupplierRepository) {}

  async execute({
    name,
    CNPJ,
    CEP,
    email,
    phone,
    companyId,
  }: ICreateSupplierUseCaseRequest) {
    const searchedCNPJ = await this.supplierRepository.findByCNPJAndCompanyId(
      CNPJ,
      companyId,
    )

    if (searchedCNPJ) {
      throw new CNPJAlreadyExistsError()
    }

    if (email) {
      const searchedEmail =
        await this.supplierRepository.findByEmailAndCompanyId(email, companyId)

      if (searchedEmail) {
        throw new EmailAlreadyExistsError()
      }
    }

    const newSupplier = await this.supplierRepository.create({
      name,
      CNPJ,
      CEP,
      email,
      phone,
      companyId,
    })

    return newSupplier
  }
}

export { CreateSupplierUseCase, ICreateSupplierUseCaseRequest }
