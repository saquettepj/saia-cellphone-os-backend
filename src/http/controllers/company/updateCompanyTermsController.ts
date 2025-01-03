import { FastifyReply, FastifyRequest } from 'fastify'

import { setupUpdateCompanyTermsUseCase } from '@/useCases/company/factory/setupUpdateCompanyTermsUseCase'

async function updateCompanyTermsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.company

  try {
    const updateCompanyTermsUseCase = setupUpdateCompanyTermsUseCase()

    await updateCompanyTermsUseCase.execute({ id })

    return reply.status(200).send()
  } catch (error) {
    throw error
  }
}

export { updateCompanyTermsController }
