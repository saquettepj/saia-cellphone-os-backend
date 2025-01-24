import { FastifyReply, FastifyRequest } from 'fastify'

import { SendEmailError } from '@/errors/sendEmailError'
import { setupChangePasswordEmailRequestUseCase } from '@/useCases/company/factory/setupChangePasswordEmailRequestUseCase'

async function changePasswordEmailRequestController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.company

  try {
    const changePasswordEmailRequestUseCase =
      setupChangePasswordEmailRequestUseCase()

    await changePasswordEmailRequestUseCase.execute({ id })

    return reply.status(200).send()
  } catch (error) {
    if (error instanceof SendEmailError) {
      return reply
        .status(400)
        .send({ message: error.message, name: error.name })
    }

    throw error
  }
}

export { changePasswordEmailRequestController }
