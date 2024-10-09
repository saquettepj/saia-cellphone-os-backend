import { randomUUID } from 'node:crypto'

import { Company, Prisma } from '@prisma/client'

import { InMemoryProductRepository } from '../product/inMemoryProductRepository'

import { ICompanyRepository } from './ICompanyRepository'

class InMemoryCompanyRepository implements ICompanyRepository {
  public companies: Prisma.CompanyCreateInput[] = []
  inMemoryProductRepository = new InMemoryProductRepository()

  async findAllIncludeById(id: string) {
    const searchedCompany = this.companies.find((company) => company.id === id)
    const searchedProducts =
      this.inMemoryProductRepository.findAllByCompanyId(id)

    if (searchedCompany !== undefined && searchedProducts !== undefined) {
      const companyWithAllProducts = Object.assign(searchedCompany, {
        products: searchedProducts,
      })
      return companyWithAllProducts as Company
    }
    return null
  }

  async updateById(id: string, data: Prisma.CompanyUpdateInput) {
    const index = this.companies.findIndex((company) => company.id === id)
    this.companies[index] = Object.assign(this.companies[index], data)

    return (this.companies[index] as Company) || null
  }

  async findByCNPJ(CNPJ: string) {
    const searchedCompany = this.companies.find(
      (company) => company.CNPJ === CNPJ,
    )
    return searchedCompany as Company
  }

  async findByEmail(email: string) {
    const searchedCompany = this.companies.find(
      (company) => company.email === email,
    )
    return searchedCompany as Company
  }

  async findById(id: string) {
    const searchedCompany = this.companies.find((company) => company.id === id)
    return searchedCompany as Company
  }

  async findAllOrderByBusiness() {
    const safeCompaniesWithProduct = this.companies.map(
      ({ CNPJ, emailConfirmationCode, passwordHash, ...remainingAttrs }) => {
        if (remainingAttrs.id) {
          return Object.assign(remainingAttrs, {
            products: this.inMemoryProductRepository.products.filter(
              (product) => product.companyId === remainingAttrs.id,
            ),
          })
        }
        return []
      },
    )

    return safeCompaniesWithProduct as Partial<Company>[]
  }

  async create(data: Prisma.CompanyCreateInput) {
    const config = { id: randomUUID() }
    this.companies.push(Object.assign(data, config))

    return data as Company
  }

  async delete(id: string) {
    const indexToDelete = this.companies.findIndex(
      (company) => company.id === id,
    )

    if (indexToDelete !== -1) {
      this.companies.splice(indexToDelete, 1)
    }

    return this.companies[indexToDelete] as Company
  }
}

export { InMemoryCompanyRepository }
