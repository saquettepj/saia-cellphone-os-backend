import { FastifyReply, FastifyRequest } from 'fastify'

import { setupUpdateCompanyPasswordUseCase } from '@/useCases/company/factory/setupUpdateCompanyPasswordUseCase'
import { IUpdateCompanyPasswordDTO } from '@/dtos/company/IUpdateCompanyPasswordDTO'
import { CompanyCredentialsError } from '@/errors/companyCredentialsError'

async function updateCompanyPasswordController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { CNPJ, password, newPassword } = IUpdateCompanyPasswordDTO.parse(
    request.body,
  )

  try {
    const updateCompanyPasswordUseCase = setupUpdateCompanyPasswordUseCase()

    await updateCompanyPasswordUseCase.execute({
      CNPJ,
      password,
      newPassword,
    })

    return reply.status(200).send()
  } catch (error) {
    if (error instanceof CompanyCredentialsError) {
      return reply.status(401).send({ message: error.message })
    }
  }
}

export { updateCompanyPasswordController }
