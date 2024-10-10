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

function setupCompanyJokerRepository() {
  const companyJokersRepository = new CompanyJokerRepository()

  return companyJokersRepository
}

export { setupCompanyJokerRepository }
