import { Prisma } from '@prisma/client'

import { ICompanyRepository } from './ICompanyRepository'

import { prisma } from '@/app'
import { AccountTypeEnum } from '@/enums/all.enum'

class CompanyRepository implements ICompanyRepository {
  async findByCNPJ(CNPJ: string) {
    const searchedCompany = await prisma.company.findUnique({
      where: { CNPJ },
      include: { accessToken: true },
    })
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
                service: true,
              },
            },
          },
        },
        clients: {
          include: {
            address: true,
          },
        },
        suppliers: {
          include: {
            products: true,
          },
        },
        employees: true,
        accessToken: true,
        NfeDataTable: true,
        address: true,
        Nfces: true,
      },
    })

    return searchedCompany
  }

  async findAll() {
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
                service: true,
              },
            },
          },
        },
        clients: true,
        employees: true,
        accessToken: true,
        NfeDataTable: true,
        address: true,
        Nfces: true,
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
      },
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

  async deleteManyByIds(ids: string[]) {
    await prisma.company.deleteMany({
      where: {
        id: { in: ids },
      },
    })
  }

  async create(
    data: Prisma.CompanyUncheckedCreateInput,
    addressData: Prisma.AddressCreateWithoutCompanyInput,
  ) {
    const createdCompany = await prisma.company.create({
      data: {
        ...data,
        address: {
          create: {
            country: addressData.country,
            city: addressData.city,
            state: addressData.state,
            neighborhood: addressData.neighborhood,
            street: addressData.street,
            streetNumber: addressData.streetNumber,
            zipCode: addressData.zipCode,
          },
        },
      },
      include: {
        address: true,
      },
    })

    return createdCompany
  }
}

export { CompanyRepository }
