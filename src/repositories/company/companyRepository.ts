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
      omit: { emailConfirmationCode: true, passwordHash: true },
      where: { id },
      include: {
        products: true,
        orders: {
          include: {
            orderItems: {
              include: {
                product: true,
              },
            },
          },
        },
        clients: {
          include: {
            address: true,
          },
        },
        employees: true,
        accessToken: true,
        NfeDataTable: true,
        address: true,
        Nfes: true,
      },
    })

    return searchedCompany
  }

  async findAllOrderByBusiness() {
    const searchedCompanies = await prisma.company.findMany({
      omit: { emailConfirmationCode: true, passwordHash: true },
      where: { accountType: AccountTypeEnum.NORMAL },
      include: {
        products: true,
        orders: {
          include: {
            orderItems: {
              include: {
                product: true,
              },
            },
          },
        },
        clients: true,
        employees: true,
        accessToken: true,
        NfeDataTable: true,
        address: true,
        Nfes: true,
      },
    })

    return searchedCompanies
  }

  async updateById(id: string, data: Prisma.CompanyUpdateInput) {
    const updatedCompany = await prisma.company.update({
      where: { id },
      data,
    })

    return updatedCompany
  }

  async updatePasswordByCNPJ(CNPJ: string, passwordHash: string) {
    const updatedCompany = await prisma.company.update({
      where: { CNPJ },
      data: {
        passwordHash,
        emailConfirmationCode: null,
        emailChecked: false,
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
