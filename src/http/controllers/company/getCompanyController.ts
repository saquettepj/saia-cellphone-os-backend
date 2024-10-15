import { FastifyReply, FastifyRequest } from 'fastify'

import { setupGetCompanyUseCase } from '@/useCases/company/factory/setupGetCompanyUseCase'
import { ICompany } from '@/repositories/company/ICompanyRepository'

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
      companies: getCompanyUseCaseReturn,
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    throw error
  }
}

export { getCompanyController }
