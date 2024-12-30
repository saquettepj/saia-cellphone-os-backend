import { FastifyReply, FastifyRequest } from 'fastify'

import { IUpdateCompanyTextMessageDTO } from '@/dtos/company/IUpdateCompanyTextMessageDTO'
import { setupUpdateCompanyTextMessageUseCase } from '@/useCases/company/factory/setupUpdateCompanyTextMessageUseCase'

async function updateCompanyTextMessageController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.company
  const { textMessage } = IUpdateCompanyTextMessageDTO.parse(request.body)

  try {
    const updateCompanyTextMessageUseCase =
      setupUpdateCompanyTextMessageUseCase()

    await updateCompanyTextMessageUseCase.execute({ id, textMessage })

    return reply.status(200).send()
  } catch (error) {
    throw error
  }
}

export { updateCompanyTextMessageController }
