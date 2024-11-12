import { FastifyReply, FastifyRequest } from 'fastify'

import { EmailAlreadyConfirmedError } from '@/errors/emailAlreadyConfirmedError'
import { setupSendEmailConfirmationUseCase } from '@/useCases/email/emailUseCaseFactory/setupSendEmailConfirmationUseCase'
import { EmailNotFoundError } from '@/errors/emailNotFoundError'

async function sendEmailConfirmationController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.company

  try {
    const sendEmailConfirmationUseCase = setupSendEmailConfirmationUseCase()

    await sendEmailConfirmationUseCase.execute({ id })

    return reply.status(200).send()
  } catch (error) {
    if (error instanceof EmailAlreadyConfirmedError) {
      return reply.status(400).send({ message: error.message })
    }
    if (error instanceof EmailNotFoundError) {
      return reply.status(400).send({ message: error.message })
    }
  }
}

export { sendEmailConfirmationController }
