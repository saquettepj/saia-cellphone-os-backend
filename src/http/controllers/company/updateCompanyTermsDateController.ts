import { FastifyReply, FastifyRequest } from 'fastify'

import { setupUpdateCompanyTermsDateUseCase } from '@/useCases/company/factory/setupUpdateCompanyTermsDateUseCase'

async function updateCompanyTermsDateController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.company

  try {
    const updateCompanyTermsUseCase = setupUpdateCompanyTermsDateUseCase()

    await updateCompanyTermsUseCase.execute({ id })

    return reply.status(200).send()
  } catch (error) {
    throw error
  }
}

export { updateCompanyTermsDateController }
