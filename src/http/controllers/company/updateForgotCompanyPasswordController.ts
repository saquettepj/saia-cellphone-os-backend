import { FastifyReply, FastifyRequest } from 'fastify'

import { IUpdateForgotCompanyPasswordDTO } from '@/dtos/company/IUpdateForgotCompanyPasswordDTO'
import { CompanyCredentialsForgotPasswordError } from '@/errors/companyCredentialsForgotPasswordError'
import { setupUpdateForgotCompanyPasswordUseCase } from '@/useCases/company/factory/setupUpdateForgotCompanyPasswordUseCase'

async function updateForgotCompanyPasswordController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { CNPJ, email } = IUpdateForgotCompanyPasswordDTO.parse(request.body)

  try {
    const updateCompanyPasswordUseCase =
      setupUpdateForgotCompanyPasswordUseCase()

    await updateCompanyPasswordUseCase.execute({
      CNPJ,
      email,
    })

    return reply.status(200).send()
  } catch (error) {
    if (error instanceof CompanyCredentialsForgotPasswordError) {
      return reply
        .status(400)
        .send({ message: error.message, name: error.name })
    }

    throw error
  }
}

export { updateForgotCompanyPasswordController }
