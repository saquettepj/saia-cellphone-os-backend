import { Prisma, Product } from '@prisma/client'

interface IProductRepository {
  findById(id: string): Promise<Product | null>
  findManyByIds(ids: string[]): Promise<Product[]>
  findByType(type: string): Promise<Product[] | null>
  findAllByCompanyId(
    companyId: string,
    data: Partial<Prisma.ProductCreateManyInput>,
  ): Promise<Product[]>
  findByDescriptionAndCompanyId(
    description: string,
    companyId: string,
  ): Promise<Product | null>
  updateById(
    id: string,
    data: Prisma.ProductUncheckedUpdateInput,
  ): Promise<Product>
  delete(id: string): Promise<Product | null>
  deleteMany(ids: string[]): Promise<number>
  create(data: Prisma.ProductUncheckedCreateInput): Promise<Product>
  createMany(data: Prisma.ProductUncheckedCreateInput[]): Promise<Product[]>
}

export { IProductRepository }
