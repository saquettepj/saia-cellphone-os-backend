import { FastifyReply, FastifyRequest } from 'fastify'

import { setupGetEmployeeUseCase } from '@/useCases/employee/factory/setupGetEmployeeUseCase'
import { EmployeeNotFoundError } from '@/errors/employeeNotFoundError'
import { IEmployee } from '@/repositories/employee/IEmployeeRepository'
import { IGetEmployeeDTO } from '@/dtos/employee/IGetEmployeeDTO'

interface IGetEmployeeControllerResponse {
  employees: Partial<IEmployee>[]
}

async function getEmployeeController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id: companyId } = request.company

  const { id, CPF, name, role, phone } = IGetEmployeeDTO.parse(request.body)

  try {
    const getEmployeeUseCase = setupGetEmployeeUseCase()
    const getEmployeeUseCaseReturn = await getEmployeeUseCase.execute({
      companyId,
      id,
      CPF,
      name,
      role,
      phone,
    })

    const responseBody: IGetEmployeeControllerResponse = {
      employees: getEmployeeUseCaseReturn.map((getEmployeeUseCaseReturn) => ({
        id: getEmployeeUseCaseReturn.id,
        name: getEmployeeUseCaseReturn.name,
        CPF: getEmployeeUseCaseReturn.CPF,
        phone: getEmployeeUseCaseReturn.phone || null,
        role: getEmployeeUseCaseReturn.role,
        companyId: getEmployeeUseCaseReturn.companyId,
        orders: getEmployeeUseCaseReturn.orders,
      })),
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    if (error instanceof EmployeeNotFoundError) {
      return reply
        .status(404)
        .send({ message: error.message, name: error.name })
    }

    throw error
  }
}

export { getEmployeeController }
