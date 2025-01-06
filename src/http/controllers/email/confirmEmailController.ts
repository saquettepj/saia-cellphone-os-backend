import { FastifyReply, FastifyRequest } from 'fastify'

import { IEmailConfirmationCodeDTO } from '@/dtos/company/IEmailConfirmationCodeDTO'
import { InvalidEmailConfirmationCodeError } from '@/errors/invalidEmailConfirmationCodeError'
import { EmailAlreadyConfirmedError } from '@/errors/emailAlreadyConfirmedError'
import { setupConfirmEmailUseCase } from '@/useCases/email/emailUseCaseFactory/setupConfirmEmailUseCase'

async function confirmEmailController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.company
  const { emailConfirmationCode } = IEmailConfirmationCodeDTO.parse(
    request.body,
  )

  try {
    const confirmEmailUseCase = setupConfirmEmailUseCase()

    await confirmEmailUseCase.execute({ id, emailConfirmationCode })

    return reply.status(200).send()
  } catch (error) {
    if (error instanceof EmailAlreadyConfirmedError) {
      return reply
        .status(400)
        .send({ message: error.message, name: error.name })
    }
    if (error instanceof InvalidEmailConfirmationCodeError) {
      return reply
        .status(400)
        .send({ message: error.message, name: error.name })
    }

    throw error
  }
}

export { confirmEmailController }
