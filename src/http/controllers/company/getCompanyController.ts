import { FastifyReply, FastifyRequest } from 'fastify'
import { Company } from '@prisma/client'

import { setupGetCompanyUseCase } from '@/useCases/company/factory/setupGetCompanyUseCase'

interface IGetCompanyControllerResponse {
  companies: Partial<Company>[] | null
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
