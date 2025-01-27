import { FastifyReply, FastifyRequest } from 'fastify'

import { setupGetCompanyUseCase } from '@/useCases/company/factory/setupGetCompanyUseCase'
import { ICompany } from '@/repositories/company/ICompanyRepository'
import { CompanyNotFoundError } from '@/errors/companyNotFoundError'

interface IGetCompanyControllerResponse {
  companies: Partial<ICompany>[]
}

async function getCompanyController(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const getCompanyUseCase = setupGetCompanyUseCase()

    const getCompanyUseCaseReturn = await getCompanyUseCase.execute()

    const responseBody: IGetCompanyControllerResponse = {
      companies: getCompanyUseCaseReturn.map((company) => ({
        id: company.id,
        CNPJ: company.CNPJ,
        email: company.email,
        name: company.name,
        createdAt: company.createdAt,
        emailChecked: company.emailChecked,
        hasCost: company.hasCost,
        textMessage: company.textMessage,
        payType: company.payType || null,
        payDate: company.payDate || null,
        termsDate: company.termsDate || null,
        accessToken: company.accessToken || null,
        address: company.address || null,
        employees: company.employees || [],
        clients: company.clients || [],
        products: company.products || [],
        orders: company.orders || [],
        Nfces: company.Nfces || [],
        suppliers: company.suppliers || [],
        lists: company.lists || [],
      })),
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    if (error instanceof CompanyNotFoundError) {
      return reply
        .status(404)
        .send({ message: error.message, name: error.name })
    }

    throw error
  }
}

export { getCompanyController }
