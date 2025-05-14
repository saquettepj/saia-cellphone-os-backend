import { Prisma } from '@prisma/client'

import { IProductRepository } from './IProductRepository'

import { prisma } from '@/app'

class ProductRepository implements IProductRepository {
  async findById(id: string) {
    const searchedProduct = await prisma.product.findUnique({ where: { id } })
    return searchedProduct
  }

  async findManyByIds(ids: string[]) {
    return prisma.product.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    })
  }

  async findByType(type: string) {
    const searchedProduct = await prisma.product.findMany({ where: { type } })
    return searchedProduct
  }

  async findAllByCompanyId(
    companyId: string,
    data: Partial<Prisma.ProductCreateManyInput>,
  ) {
    const searchedProducts = await prisma.product.findMany({
      where: {
        companyId,
        ...(data.id && { id: { contains: data.id } }),
        ...(data.type && { type: { contains: data.type } }),
        ...(data.condition && { condition: { contains: data.condition } }),
        ...(data.description && {
          description: { contains: data.description },
        }),
        ...(data.price && { price: data.price }),
        ...(data.cost && { cost: data.cost }),
        ...(data.quantity && { quantity: data.quantity }),
        ...(data.localization && {
          localization: { contains: data.localization },
        }),
        ...(data.supplierId && { supplierId: { contains: data.supplierId } }),
      },
    })

    return searchedProducts
  }

  async findByDescriptionAndCompanyId(description: string, companyId: string) {
    const searchedProduct = await prisma.product.findFirst({
      where: {
        description,
        companyId,
      },
    })

    return searchedProduct
  }

  async updateById(id: string, data: Prisma.ProductUpdateInput) {
    const updatedProduct = await prisma.product.update({ where: { id }, data })

    return updatedProduct
  }

  async delete(id: string) {
    const deletedProduct = await prisma.product.delete({ where: { id } })

    return deletedProduct
  }

  async deleteMany(ids: string[]) {
    const deletedProducts = await prisma.product.deleteMany({
      where: { id: { in: ids } },
    })

    return deletedProducts.count
  }

  async create(data: Prisma.ProductUncheckedCreateInput) {
    const createdProduct = await prisma.product.create({ data })

    return createdProduct
  }

  async createMany(data: Prisma.ProductUncheckedCreateInput[]) {
    const createdProducts = await prisma.$transaction(
      data.map((product) => prisma.product.create({ data: product })),
    )

    return createdProducts
  }
}

export { ProductRepository }
