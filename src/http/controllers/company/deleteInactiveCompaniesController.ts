import { FastifyReply, FastifyRequest } from 'fastify'

import { setupDeleteInactiveCompaniesUseCase } from '@/useCases/company/factory/setupDeleteInactiveCompaniesUseCase'
import { DeletingError } from '@/errors/deletingError'
import { IDeleteCompanyDTO } from '@/dtos/company/IDeleteCompanyDTO'

async function deleteInactiveCompaniesController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { password } = IDeleteCompanyDTO.parse(request.body)

  try {
    const deleteInactiveCompaniesUseCase = setupDeleteInactiveCompaniesUseCase()

    await deleteInactiveCompaniesUseCase.execute({ password })

    return reply.status(200).send()
  } catch (error) {
    if (error instanceof DeletingError) {
      return reply
        .status(500)
        .send({ message: error.message, name: error.name })
    }

    throw error
  }
}

export { deleteInactiveCompaniesController }
