import { FastifyReply, FastifyRequest } from 'fastify'

import { setupResetCompanyPasswordUseCase } from '@/useCases/company/factory/setupResetCompanyPasswordUseCase'
import { NotFoundError } from '@/errors/notFoundError'
import { LinkExpiredError } from '@/errors/linkExpiredError'

async function resetCompanyPasswordController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { token, newPassword } = request.body as {
    token: string
    newPassword: string
  }

  try {
    const resetPasswordUseCase = setupResetCompanyPasswordUseCase()

    await resetPasswordUseCase.execute({ token, newPassword })

    return reply.status(200).send()
  } catch (error) {
    if (error instanceof NotFoundError) {
      return reply
        .status(400)
        .send({ message: error.message, name: error.name })
    }

    if (error instanceof LinkExpiredError) {
      return reply
        .status(400)
        .send({ message: error.message, name: error.name })
    }

    throw error
  }
}

export { resetCompanyPasswordController }
