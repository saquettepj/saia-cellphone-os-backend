import {
  AccessToken,
  Address,
  Client,
  Company,
  Employee,
  Nfce,
  Order,
  Prisma,
  Product,
  Supplier,
} from '@prisma/client'

interface ICompany extends Company {
  accessToken?: AccessToken | null
  address?: Address | null
  employees?: Employee[] | null
  clients?: Client[] | null
  products?: Product[] | null
  orders?: Order[] | null
  nfces?: Nfce[] | null
  suppliers?: Supplier[] | null
}

interface ICompanyRepository {
  findByCNPJ(CNPJ: string): Promise<ICompany | null>
  findByEmail(email: string): Promise<ICompany | null>
  findById(id: string): Promise<ICompany | null>
  findAllIncludeById(id: string): Promise<Partial<ICompany> | null>
  findAll(): Promise<Partial<ICompany>[]>
  updateById(id: string, data: Prisma.CompanyUpdateInput): Promise<ICompany>
  updatePasswordByCNPJ(CNPJ: string, passwordHash: string): Promise<ICompany>
  updatePasswordById(id: string, passwordHash: string): Promise<ICompany>
  delete(id: string): Promise<ICompany | null>
  delete(id: string): Promise<ICompany | null>
  deleteManyByIds(ids: string[]): Promise<void>
  create(
    data: Prisma.CompanyUncheckedCreateInput,
    addressData: Prisma.AddressCreateWithoutCompanyInput,
  ): Promise<ICompany>
}

export { ICompanyRepository, ICompany }
