import { FastifyReply, FastifyRequest } from 'fastify'

import { IUpdateCompanyHasCostDTO } from '@/dtos/company/IUpdateCompanyHasCostDTO.ts'
import { setupUpdateCompanyHasCostUseCase } from '@/useCases/company/factory/setupUpdateCompanyHasCostUseCase'

async function updateCompanyHasCostController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.company
  const { hasCost } = IUpdateCompanyHasCostDTO.parse(request.body)

  try {
    const updateCompanyHasCostUseCase = setupUpdateCompanyHasCostUseCase()

    await updateCompanyHasCostUseCase.execute({ id, hasCost })

    return reply.status(200).send()
  } catch (error) {
    throw error
  }
}

export { updateCompanyHasCostController }
