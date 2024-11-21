import { FastifyReply, FastifyRequest } from 'fastify'

import { setupDeleteEmployeeUseCase } from '@/useCases/employee/factory/setupDeleteEmployeeUseCase'
import { EmployeeNotFoundError } from '@/errors/employeeNotFoundError'
import { ISimpleEmployeeDTO } from '@/dtos/employee/ISimpleEmployeeDTO'

async function deleteEmployeeController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = ISimpleEmployeeDTO.parse(request.params)

  try {
    const deleteEmployeeUseCase = setupDeleteEmployeeUseCase()
    await deleteEmployeeUseCase.execute({ id })

    return reply.status(204).send()
  } catch (error) {
    if (error instanceof EmployeeNotFoundError) {
      return reply
        .status(404)
        .send({ message: error.message, name: error.name })
    }

    throw error
  }
}

export { deleteEmployeeController }
