import { FastifyReply, FastifyRequest } from 'fastify'

import { ISendSupportEmailDTO } from '@/dtos/email/ISendSupportEmailDTO'
import { SendEmailError } from '@/errors/sendEmailError'
import { setupSendSupportEmailUseCase } from '@/useCases/email/factory/setupSendSupportEmailUseCase'

async function sendSupportEmailController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.company
  const { text } = ISendSupportEmailDTO.parse(request.body)

  try {
    const sendSupportEmailUseCase = setupSendSupportEmailUseCase()

    await sendSupportEmailUseCase.execute({ id, text })

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

export { sendSupportEmailController }
