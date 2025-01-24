import { FastifyReply, FastifyRequest } from 'fastify'

import { setupVerifyResetPasswordTokenUseCase } from '@/useCases/company/factory/setupVerifyResetPasswordTokenUseCase'
import { LinkExpiredError } from '@/errors/linkExpiredError'

async function verifyResetPasswordTokenController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { token } = request.body as { token?: string }

  try {
    const verifyResetPasswordTokenUseCase =
      setupVerifyResetPasswordTokenUseCase()

    await verifyResetPasswordTokenUseCase.execute({ token })

    return reply.status(200).send()
  } catch (error) {
    if (error instanceof LinkExpiredError) {
      return reply
        .status(400)
        .send({ message: error.message, name: error.name })
    }
  }
}

export { verifyResetPasswordTokenController }
