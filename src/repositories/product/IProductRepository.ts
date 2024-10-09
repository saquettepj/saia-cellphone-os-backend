import { Prisma, Product } from '@prisma/client'

interface IProductRepository {
  findById(id: string): Promise<Product | null>
  findByModel(model: string): Promise<Product[] | null>
  findAllByCompanyId(
    companyId: string,
    data: Partial<Prisma.ProductCreateManyInput>,
  ): Promise<Product[]>
  updateById(id: string, data: Prisma.ProductUpdateInput): Promise<Product>
  delete(id: string): Promise<Product | null>
  deleteMany(ids: string[]): Promise<Product[]>
  create(data: Prisma.ProductUncheckedCreateInput): Promise<Product>
}

export { IProductRepository }
