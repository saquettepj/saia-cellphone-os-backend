import { DeletingError } from '@/errors/deletingError'
import { ICompanyRepository } from '@/repositories/company/ICompanyRepository'
import { env } from '@/env'

interface IDeleteInactiveCompaniesUseCaseRequest {
  password: string
}

class DeleteInactiveCompaniesUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute({ password }: IDeleteInactiveCompaniesUseCaseRequest) {
    if (!password || password !== env.ADMIN_DELETE_PASSWORD) {
      throw new DeletingError()
    }

    const currentDate = new Date()
    const oneYearAgo = new Date(
      currentDate.getFullYear() - 2,
      currentDate.getMonth(),
      currentDate.getDate(),
    )

    const companies = await this.companyRepository.findAll()

    if (!companies || companies.length < 1) {
      throw new DeletingError()
    }

    const companiesToDelete = companies.filter((company) => {
      const payDate = company.payDate ? new Date(company.payDate) : null
      const creationDate = new Date(company.createdAt || new Date())

      return (
        (payDate && payDate < oneYearAgo) ||
        (!payDate && creationDate < oneYearAgo)
      )
    })

    const companyIdsToDelete = companiesToDelete.map(
      (company) => company.id as string,
    )

    if (!companyIdsToDelete || companyIdsToDelete.length < 1) {
      return
    }

    await this.companyRepository.deleteManyByIds(companyIdsToDelete)
  }
}

export {
  DeleteInactiveCompaniesUseCase,
  IDeleteInactiveCompaniesUseCaseRequest,
}
