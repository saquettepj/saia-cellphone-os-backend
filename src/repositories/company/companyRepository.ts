import { Prisma } from '@prisma/client'

import { ICompanyRepository } from './ICompanyRepository'

import { prisma } from '@/app'
import { AccountTypeEnum } from '@/enums/all.enum'

class CompanyRepository implements ICompanyRepository {
  async findByCNPJ(CNPJ: string) {
    const searchedCompany = await prisma.company.findUnique({ where: { CNPJ } })
    return searchedCompany
  }

  async findByEmail(email: string) {
    const searchedCompany = await prisma.company.findUnique({
      where: { email },
    })
    return searchedCompany
  }

  async findById(id: string) {
    const searchedCompany = await prisma.company.findUnique({ where: { id } })
    return searchedCompany
  }

  async findAllIncludeById(id: string) {
    const searchedCompany = await prisma.company.findUnique({
      where: { id },
      include: {
        accessToken: { where: { companyId: id } },
        address: { where: { companyId: id } },
        employees: { where: { companyId: id } },
        clients: { where: { companyId: id } },
        products: { where: { companyId: id } },
        orders: { where: { companyId: id } },
        Nfes: { where: { companyId: id } },
      },
    })

    return searchedCompany
  }

  async findAllOrderByBusiness() {
    const searchedCompanies = await prisma.company.findMany({
      omit: { emailConfirmationCode: true, passwordHash: true },
      where: { accountType: AccountTypeEnum.NORMAL },
    })

    return searchedCompanies
  }

  async updateById(id: string, data: Prisma.CompanyUpdateInput) {
    console.log(1)
    const updatedCompany = await prisma.company.update({
      where: { id },
      data,
    })
    console.log(2)

    console.log(3, updatedCompany)
    return updatedCompany
  }

  async updatePasswordByCNPJ(CNPJ: string, passwordHash: string) {
    const updatedCompany = await prisma.company.update({
      where: { CNPJ },
      data: {
        passwordHash,
      },
    })

    return updatedCompany
  }

  async delete(id: string) {
    const deletedCompany = await prisma.company.delete({ where: { id } })

    return deletedCompany
  }

  async create(data: Prisma.CompanyUncheckedCreateInput) {
    const createdCompany = await prisma.company.create({
      data,
    })

    return createdCompany
  }
}

export { CompanyRepository }
