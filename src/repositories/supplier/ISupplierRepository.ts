import { Prisma, Supplier } from '@prisma/client'

interface ISupplierRepository {
  findById(id: string): Promise<Supplier | null>
  findByCNPJ(CNPJ: string): Promise<Supplier | null>
  findByCNPJAndCompanyId(
    CNPJ: string,
    companyId: string,
  ): Promise<Supplier | null>
  findByEmail(email: string): Promise<Supplier | null>
  findByEmailAndCompanyId(
    email: string,
    companyId: string,
  ): Promise<Supplier | null>
  findAllByCompanyId(
    companyId: string,
    data: Partial<Prisma.SupplierCreateManyInput>,
  ): Promise<Supplier[]>
  create(data: Prisma.SupplierUncheckedCreateInput): Promise<Supplier>
  updateById(id: string, data: Prisma.SupplierUpdateInput): Promise<Supplier>
  delete(id: string): Promise<Supplier | null>
  deleteMany(ids: string[]): Promise<number>
}

export { ISupplierRepository }
