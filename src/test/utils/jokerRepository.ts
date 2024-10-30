import { Product } from '@prisma/client'

import { prisma } from '@/app'
import { ICompany } from '@/repositories/company/ICompanyRepository'

class CompanyJokerRepository {
  async findById(id: string): Promise<ICompany | null> {
    const searchedCompany = await prisma.company.findFirst({ where: { id } })
    return searchedCompany
  }

  async findByCNPJ(CNPJ: string): Promise<ICompany | null> {
    const searchedCompany = await prisma.company.findFirst({ where: { CNPJ } })
    return searchedCompany
  }
}

class ProductJokerRepository {
  async findById(id: string): Promise<Product | null> {
    const searchedProduct = await prisma.product.findFirst({ where: { id } })
    return searchedProduct
  }
}

function setupCompanyJokerRepository() {
  const companyJokersRepository = new CompanyJokerRepository()

  return companyJokersRepository
}

function setupProductJokerRepository() {
  const productJokersRepository = new ProductJokerRepository()

  return productJokersRepository
}

export { setupCompanyJokerRepository, setupProductJokerRepository }
