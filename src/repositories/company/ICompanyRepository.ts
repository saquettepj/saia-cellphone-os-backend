import { Company, Prisma, Product } from '@prisma/client'

interface ICompany extends Company {
  products?: Product[] | null
}

interface ICompanyRepository {
  findByCNPJ(CNPJ: string): Promise<ICompany | null>
  findByEmail(email: string): Promise<ICompany | null>
  findById(id: string): Promise<ICompany | null>
  findAllIncludeById(id: string): Promise<ICompany | null>
  findAllOrderByBusiness(): Promise<Partial<ICompany>[]>
  updateById(id: string, data: Prisma.CompanyUpdateInput): Promise<ICompany>
  updatePasswordById(id: string, passwordHash: string): Promise<ICompany>
  delete(id: string): Promise<ICompany | null>
  create(data: Prisma.CompanyCreateInput): Promise<ICompany>
}

export { ICompanyRepository, ICompany }
