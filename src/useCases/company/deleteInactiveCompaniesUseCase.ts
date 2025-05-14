import { DeletingError } from '@/errors/deletingError'
import { ICompanyRepository } from '@/repositories/company/ICompanyRepository'
import { env } from '@/env'
import { AccountPayTypeEnum } from '@/enums/all.enum'
import { NotFoundError } from '@/errors/notFoundError'

interface IDeleteInactiveCompaniesUseCaseRequest {
  password: string
}

class DeleteInactiveCompaniesUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute({ password }: IDeleteInactiveCompaniesUseCaseRequest) {
    if (!password || password !== env.ADMIN_DELETE_PASSWORD) {
      throw new DeletingError()
    }

    const companies = await this.companyRepository.findAll()

    if (!companies || companies.length < 1) {
      throw new DeletingError()
    }

    const currentDate = new Date()

    const companiesToDelete = companies.filter((company) => {
      const payDate = company.payDate ? new Date(company.payDate) : null
      const payType = company.payType
      const createdAt = new Date(company.createdAt || '')

      let monthsToDelete: number
      let referenceDate: Date

      if (!payDate || !payType) {
        monthsToDelete = 3
        referenceDate = createdAt
      } else {
        switch (payType) {
          case AccountPayTypeEnum.ANNUAL:
            monthsToDelete = 15
            break
          case AccountPayTypeEnum.SEMIANNUAL:
            monthsToDelete = 9
            break
          case AccountPayTypeEnum.MONTHLY:
          default:
            monthsToDelete = 4
            break
        }
        referenceDate = payDate
      }

      const limitDate = new Date(currentDate)
      limitDate.setMonth(limitDate.getMonth() - monthsToDelete)

      return referenceDate < limitDate
    })

    const companyIdsToDelete = companiesToDelete.map(
      (company) => company.id as string,
    )

    if (!companyIdsToDelete.length) {
      throw new NotFoundError()
    }

    await this.companyRepository.deleteManyByIds(companyIdsToDelete)
  }
}

export {
  DeleteInactiveCompaniesUseCase,
  IDeleteInactiveCompaniesUseCaseRequest,
}
