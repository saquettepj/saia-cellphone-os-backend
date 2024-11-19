import { FastifyReply, FastifyRequest } from 'fastify'

import { ISimpleSupplierDTO } from '@/dtos/supplier/ISimpleSupplierDTO'
import { setupDeleteSupplierUseCase } from '@/useCases/supplier/factory/setupDeleteSupplierUseCase'

async function deleteSupplierController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = ISimpleSupplierDTO.parse(request.params)

  try {
    const deleteSupplierUseCase = setupDeleteSupplierUseCase()
    await deleteSupplierUseCase.execute({ id })

    return reply.status(200).send({ id })
  } catch (error) {
    throw error
  }
}

export { deleteSupplierController }
