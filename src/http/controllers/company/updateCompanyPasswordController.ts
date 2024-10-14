import { FastifyReply, FastifyRequest } from 'fastify'

import { setupUpdateCompanyPasswordUseCase } from '@/useCases/company/factory/setupUpdateCompanyPasswordUseCase'
import { IUpdateCompanyPasswordDTO } from '@/dtos/company/IUpdateCompanyPasswordDTO'
import { CompanyCredentialsError } from '@/errors/companyCredentialsError'
import { PasswordConfirmationIsDifferentError } from '@/errors/passwordConfirmationIsDifferentError'

async function updateCompanyPasswordController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { CNPJ, currentPassword, newPassword, passwordConfirmation } =
    IUpdateCompanyPasswordDTO.parse(request.body)

  try {
    const updateCompanyPasswordUseCase = setupUpdateCompanyPasswordUseCase()

    await updateCompanyPasswordUseCase.execute({
      CNPJ,
      currentPassword,
      newPassword,
      passwordConfirmation,
    })

    return reply.status(200).send()
  } catch (error) {
    if (error instanceof CompanyCredentialsError) {
      return reply.status(401).send({ message: error.message })
    }
    if (error instanceof PasswordConfirmationIsDifferentError) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
}

export { updateCompanyPasswordController }
