import { FastifyReply, FastifyRequest } from 'fastify'

import { ICreateEmployeeDTO } from '@/dtos/employee/ICreateEmployeeDTO'
import { setupCreateEmployeeUseCase } from '@/useCases/employee/factory/setupCreateEmployeeUseCase'
import { CPFAlreadyExistsError } from '@/errors/CPFAlreadyExistsError'
import { ISimpleCompanyDTO } from '@/dtos/company/ISimpleCompanyDTO'

interface ICreateEmployeeControllerResponse {
  id: string
  name: string
  CPF: string
  phone?: string | null
  role: string
  companyId: string
}

async function createEmployeeController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id: companyId } = ISimpleCompanyDTO.parse(request.company)
  const { name, CPF, phone, role } = ICreateEmployeeDTO.parse(request.body)

  try {
    const createEmployeeUseCase = setupCreateEmployeeUseCase()

    const employee = await createEmployeeUseCase.execute({
      name,
      CPF,
      phone,
      role,
      companyId,
    })

    const responseBody: ICreateEmployeeControllerResponse = {
      id: employee.id,
      name: employee.name,
      CPF: employee.CPF,
      phone: employee.phone || null,
      role: employee.role,
      companyId: employee.companyId,
    }

    return reply.status(201).send(responseBody)
  } catch (error) {
    if (error instanceof CPFAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }
    throw error
  }
}

export { createEmployeeController }
