import { FastifyReply, FastifyRequest } from 'fastify'

import { IUpdateCompanyTermsDTO } from '@/dtos/company/IUpdateCompanyTermsDTO'
import { setupUpdateCompanyTermsUseCase } from '@/useCases/company/factory/setupUpdateCompanyTermsUseCase'

async function updateCompanyTermsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.company
  const { termsDate } = IUpdateCompanyTermsDTO.parse(request.body)

  try {
    const updateCompanyTermsUseCase = setupUpdateCompanyTermsUseCase()

    await updateCompanyTermsUseCase.execute({ id, termsDate })

    return reply.status(200).send()
  } catch (error) {
    throw error
  }
}

export { updateCompanyTermsController }
