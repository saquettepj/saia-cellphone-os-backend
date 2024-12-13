import { Product } from '@prisma/client'

import { prisma } from '@/app'
import { ICompany } from '@/repositories/company/ICompanyRepository'
import { IOrder } from '@/repositories/order/IOrderRepository'

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

class OrderJokerRepository {
  async findById(id: string): Promise<IOrder | null> {
    const searchedOrder = await prisma.order.findFirst({
      where: { id },
      include: {
        orderItems: {
          include: {
            service: true,
          },
        },
      },
    })
    return searchedOrder
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
function setupOrderJokerRepository() {
  const orderJokersRepository = new OrderJokerRepository()

  return orderJokersRepository
}

export {
  setupCompanyJokerRepository,
  setupProductJokerRepository,
  setupOrderJokerRepository,
}
