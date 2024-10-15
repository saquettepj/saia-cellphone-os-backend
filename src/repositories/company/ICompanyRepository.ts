import {
  AccessToken,
  Address,
  Client,
  Company,
  Employee,
  Nfe,
  Order,
  Prisma,
  Product,
} from '@prisma/client'

interface ICompany extends Company {
  accessToken?: AccessToken | null
  address?: Address | null
  employees?: Employee[] | null
  clients?: Client[] | null
  products?: Product[] | null
  orders?: Order[] | null
  Nfes?: Nfe[] | null
}

interface ICompanyRepository {
  findByCNPJ(CNPJ: string): Promise<ICompany | null>
  findByEmail(email: string): Promise<ICompany | null>
  findById(id: string): Promise<ICompany | null>
  findAllIncludeById(id: string): Promise<ICompany | null>
  findAllOrderByBusiness(): Promise<Partial<ICompany>[]>
  updateById(id: string, data: Prisma.CompanyUpdateInput): Promise<ICompany>
  updatePasswordByCNPJ(CNPJ: string, passwordHash: string): Promise<ICompany>
  delete(id: string): Promise<ICompany | null>
  create(data: Prisma.CompanyUncheckedCreateInput): Promise<ICompany>
}

export { ICompanyRepository, ICompany }
