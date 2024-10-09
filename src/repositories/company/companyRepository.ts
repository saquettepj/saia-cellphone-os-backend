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
      include: { products: { where: { companyId: id } } },
    })
    return searchedCompany
  }

  async findAllOrderByBusiness() {
    const searchedCompanies = await prisma.company.findMany({
      where: {
        OR: [{ accountType: AccountTypeEnum.NORMAL }],
      },
      include: { products: true },
    })

    const safeSearchedCompanies = searchedCompanies.map(
      ({ emailConfirmationCode, passwordHash, ...remainingAttrs }) =>
        remainingAttrs,
    )

    return safeSearchedCompanies
  }

  async updateById(id: string, data: Prisma.CompanyUpdateInput) {
    const updatedCompany = await prisma.company.update({
      where: { id },
      data,
    })

    return updatedCompany
  }

  async updatePasswordById(id: string, passwordHash: string) {
    const updatedCompany = await prisma.company.update({
      where: { id },
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

  async create(data: Prisma.CompanyCreateInput) {
    const createdCompany = await prisma.company.create({
      data,
    })

    return createdCompany
  }
}

export { CompanyRepository }
