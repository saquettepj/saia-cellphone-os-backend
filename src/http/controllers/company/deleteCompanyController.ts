import { FastifyReply, FastifyRequest } from 'fastify'

import { setupDeleteCompanyUseCase } from '@/useCases/company/factory/setupDeleteCompanyUseCase'
import { ISimpleCompanyDTO } from '@/dtos/company/ISimpleCompanyDTO'
import { DeletingError } from '@/errors/deletingError'

async function deleteCompanyController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = ISimpleCompanyDTO.parse(request.params)

  try {
    const deleteCompanyUseCase = setupDeleteCompanyUseCase()

    await deleteCompanyUseCase.execute({ id })
    return reply.status(204).send()
  } catch (error) {
    if (error instanceof DeletingError) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
}

export { deleteCompanyController }
