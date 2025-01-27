import { FastifyReply, FastifyRequest } from 'fastify'

import { ICompany } from '@/repositories/company/ICompanyRepository'
import { CompanyNotFoundError } from '@/errors/companyNotFoundError'
import { setupGetCompanyByIdUseCase } from '@/useCases/company/factory/setupGetCompanyByIdUseCase'
import { ISimpleCompanyDTO } from '@/dtos/company/ISimpleCompanyDTO'

interface IGetCompanyByIdControllerResponse {
  company: Partial<ICompany>
}

async function getCompanyByIdController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = ISimpleCompanyDTO.parse(request.params)

  try {
    const getCompanyByIdUseCase = setupGetCompanyByIdUseCase()

    const getCompanyByIdUseCaseReturn = await getCompanyByIdUseCase.execute({
      id,
    })

    const responseBody: IGetCompanyByIdControllerResponse = {
      company: {
        id: getCompanyByIdUseCaseReturn.id,
        CNPJ: getCompanyByIdUseCaseReturn.CNPJ,
        email: getCompanyByIdUseCaseReturn.email,
        name: getCompanyByIdUseCaseReturn.name,
        createdAt: getCompanyByIdUseCaseReturn.createdAt,
        emailChecked: getCompanyByIdUseCaseReturn.emailChecked,
        hasCost: getCompanyByIdUseCaseReturn.hasCost,
        textMessage: getCompanyByIdUseCaseReturn.textMessage,
        payDate: getCompanyByIdUseCaseReturn.payDate || null,
        termsDate: getCompanyByIdUseCaseReturn.termsDate || null,
        companyTerms: getCompanyByIdUseCaseReturn.companyTerms || null,
        accessToken: getCompanyByIdUseCaseReturn.accessToken || null,
        address: getCompanyByIdUseCaseReturn.address || null,
        employees: getCompanyByIdUseCaseReturn.employees || [],
        clients: getCompanyByIdUseCaseReturn.clients || [],
        products: getCompanyByIdUseCaseReturn.products || [],
        orders: getCompanyByIdUseCaseReturn.orders || [],
        Nfces: getCompanyByIdUseCaseReturn.Nfces || [],
        suppliers: getCompanyByIdUseCaseReturn.suppliers || [],
        lists: getCompanyByIdUseCaseReturn.lists || [],
      },
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

export { getCompanyByIdController }
