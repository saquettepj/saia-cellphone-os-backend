import { FastifyReply, FastifyRequest } from 'fastify'

import { setupDeleteCompanyUseCase } from '@/useCases/company/factory/setupDeleteCompanyUseCase'
import { DeletingError } from '@/errors/deletingError'
import { IDeleteCompanyDTO } from '@/dtos/company/IDeleteCompanyDTO'
import { ISimpleCompanyDTO } from '@/dtos/company/ISimpleCompanyDTO'

async function deleteCompanyController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = ISimpleCompanyDTO.parse(request.params)
  const { password } = IDeleteCompanyDTO.parse(request.body)

  try {
    const deleteCompanyUseCase = setupDeleteCompanyUseCase()

    await deleteCompanyUseCase.execute({ id, password })
    return reply.status(204).send()
  } catch (error) {
    if (error instanceof DeletingError) {
      return reply
        .status(400)
        .send({ message: error.message, name: error.name })
    }

    throw error
  }
}

export { deleteCompanyController }
