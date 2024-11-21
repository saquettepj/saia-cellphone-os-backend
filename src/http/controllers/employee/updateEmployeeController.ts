import { FastifyReply, FastifyRequest } from 'fastify'

import { IUpdateEmployeeDTO } from '@/dtos/employee/IUpdateEmployeeDTO'
import { setupUpdateEmployeeUseCase } from '@/useCases/employee/factory/setupUpdateEmployeeUseCase'
import { EmployeeNotFoundError } from '@/errors/employeeNotFoundError'
import { ISimpleEmployeeDTO } from '@/dtos/employee/ISimpleEmployeeDTO'
import { CPFAlreadyExistsError } from '@/errors/CPFAlreadyExistsError'

interface IUpdateEmployeeControllerResponse {
  id: string
  name: string
  CPF: string
  phone?: string | null
  role: string
  companyId: string
}

async function updateEmployeeController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id: companyId } = request.company

  const { id } = ISimpleEmployeeDTO.parse(request.params)
  const { name, CPF, phone, role } = IUpdateEmployeeDTO.parse(request.body)

  try {
    const updateEmployeeUseCase = setupUpdateEmployeeUseCase()

    const updatedEmployee = await updateEmployeeUseCase.execute({
      companyId,
      id,
      name,
      CPF,
      phone,
      role,
    })

    const responseBody: IUpdateEmployeeControllerResponse = {
      id: updatedEmployee.id,
      name: updatedEmployee.name,
      CPF: updatedEmployee.CPF,
      phone: updatedEmployee.phone || null,
      role: updatedEmployee.role,
      companyId: updatedEmployee.companyId,
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    if (error instanceof EmployeeNotFoundError) {
      return reply
        .status(404)
        .send({ message: error.message, name: error.name })
    }

    if (error instanceof CPFAlreadyExistsError) {
      return reply
        .status(409)
        .send({ message: error.message, name: error.name })
    }

    throw error
  }
}

export { updateEmployeeController }
