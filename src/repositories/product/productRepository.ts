import { Prisma, Product } from '@prisma/client'

import { IProductRepository } from './IProductRepository'

import { prisma } from '@/app'

class ProductRepository implements IProductRepository {
  async findById(id: string) {
    const searchedProduct = await prisma.product.findUnique({ where: { id } })
    return searchedProduct
  }

  async findByModel(model: string) {
    const searchedProduct = await prisma.product.findMany({ where: { model } })
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
        ...(data.manufactureBy && {
          manufactureBy: { contains: data.manufactureBy },
        }),
        ...(data.model && { model: { contains: data.model } }),
        ...(data.condition && { condition: { contains: data.condition } }),
        ...(data.description !== undefined && {
          description: { contains: data.description || '' },
        }),
      },
    })

    return searchedProducts
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
    const searchedProducts = await prisma.product.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    })

    await prisma.product.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    })

    return searchedProducts
  }

  async create(data: Prisma.ProductUncheckedCreateInput) {
    const createdProduct = await prisma.product.create({
      data,
    })

    return createdProduct
  }
}

export { ProductRepository }
