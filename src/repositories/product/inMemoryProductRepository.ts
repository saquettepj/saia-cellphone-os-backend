import { randomUUID } from 'node:crypto'

import { Prisma, Product } from '@prisma/client'

import { IProductRepository } from './IProductRepository'

class InMemoryProductRepository implements IProductRepository {
  public products: Prisma.ProductUncheckedCreateInput[] = []

  async findAllByCompanyId(id: string) {
    const searchedProduct = this.products.filter(
      (product) => product.companyId === id,
    )

    return searchedProduct as Product[]
  }

  async updateById(id: string, data: Prisma.ProductUpdateInput) {
    const index = this.products.findIndex((product) => product.id === id)
    this.products[index] = Object.assign(this.products[index], data)

    return this.products[index] as Product
  }

  async findByModel(model: string) {
    const searchedProduct =
      this.products.filter((product) => product.model === model) || null
    return searchedProduct as Product[]
  }

  async findById(id: string) {
    const searchedProduct =
      this.products.find((product) => product.id === id) || null
    return searchedProduct as Product
  }

  async create(data: Prisma.ProductUncheckedCreateInput) {
    const config = { id: randomUUID() }
    this.products.push(Object.assign(data, config))

    return data as Product
  }

  async delete(id: string) {
    const indexToDelete = this.products.findIndex(
      (company) => company.id === id,
    )

    if (indexToDelete !== -1) {
      this.products.splice(indexToDelete, 1)
    }

    return this.products[indexToDelete] as Product
  }
}

export { InMemoryProductRepository }
