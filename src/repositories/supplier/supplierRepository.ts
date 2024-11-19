import { Prisma } from '@prisma/client'

import { ISupplierRepository } from './ISupplierRepository'

import { prisma } from '@/app'

class SupplierRepository implements ISupplierRepository {
  async findById(id: string) {
    const supplier = await prisma.supplier.findUnique({ where: { id } })
    return supplier
  }

  async create(data: Prisma.SupplierUncheckedCreateInput) {
    const newSupplier = await prisma.supplier.create({ data })
    return newSupplier
  }

  async updateById(id: string, data: Prisma.SupplierUpdateInput) {
    const updatedSupplier = await prisma.supplier.update({
      where: { id },
      data,
    })
    return updatedSupplier
  }

  async delete(id: string) {
    const deletedSupplier = await prisma.supplier.delete({ where: { id } })
    return deletedSupplier
  }

  async deleteMany(ids: string[]) {
    const deletedSuppliers = await prisma.supplier.deleteMany({
      where: { id: { in: ids } },
    })
    return deletedSuppliers.count
  }

  async findByCNPJ(CNPJ: string) {
    const supplier = await prisma.supplier.findFirst({ where: { CNPJ } })
    return supplier
  }

  async findByCNPJAndCompanyId(CNPJ: string, companyId: string) {
    const supplier = await prisma.supplier.findFirst({
      where: {
        companyId,
        CNPJ,
      },
    })
    return supplier
  }

  async findByEmail(email: string) {
    const supplier = await prisma.supplier.findFirst({ where: { email } })
    return supplier
  }

  async findByEmailAndCompanyId(email: string, companyId: string) {
    const supplier = await prisma.supplier.findFirst({
      where: {
        email,
        companyId,
      },
    })
    return supplier
  }

  async findAllByCompanyId(
    companyId: string,
    data: Partial<Prisma.SupplierCreateManyInput>,
  ) {
    const searchedSuppliers = await prisma.supplier.findMany({
      where: {
        companyId,
        ...(data.id && { id: { contains: data.id } }),
        ...(data.CNPJ && { CNPJ: { contains: data.CNPJ } }),
        ...(data.CEP && { CEP: { contains: data.CEP } }),
        ...(data.email && { email: { contains: data.email } }),
        ...(data.phone && { phone: { contains: data.phone } }),
        ...(data.name && { name: { contains: data.name } }),
      },
    })

    return searchedSuppliers
  }
}

export { SupplierRepository }
