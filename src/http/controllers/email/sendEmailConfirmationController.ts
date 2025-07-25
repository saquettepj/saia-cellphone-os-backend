import { FastifyReply, FastifyRequest } from 'fastify'

import { EmailAlreadyConfirmedError } from '@/errors/emailAlreadyConfirmedError'
import { setupSendEmailConfirmationUseCase } from '@/useCases/email/emailUseCaseFactory/setupSendEmailConfirmationUseCase'
import { EmailNotFoundError } from '@/errors/emailNotFoundError'
import { SendEmailError } from '@/errors/sendEmailError'

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
    if (error instanceof SendEmailError) {
      return reply
        .status(400)
        .send({ message: error.message, name: error.name })
    }
    if (error instanceof EmailAlreadyConfirmedError) {
      return reply
        .status(400)
        .send({ message: error.message, name: error.name })
    }
    if (error instanceof EmailNotFoundError) {
      return reply
        .status(400)
        .send({ message: error.message, name: error.name })
    }

    throw error
  }
}

export { sendEmailConfirmationController }
