import { FastifyReply, FastifyRequest } from 'fastify'

import { ICreateServiceDTO } from '@/dtos/service/ICreateServiceDTO'
import { setupCreateServiceUseCase } from '@/useCases/service/factory/setupCreateServiceUseCase'
import { OrderItemNotFoundError } from '@/errors/orderItemNotFoundError'
import { EmployeeNotFoundError } from '@/errors/employeeNotFoundError'

interface ICreateServiceControllerResponse {
  id: string
  orderItemId: string
  employeeId: string
  status: string
  report?: string | null
}

async function createServiceController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { orderItemId, employeeId, status, report } = ICreateServiceDTO.parse(
    request.body,
  )

  try {
    const createServiceUseCase = setupCreateServiceUseCase()

    const createServiceUseCaseReturn = await createServiceUseCase.execute({
      orderItemId,
      employeeId,
      status,
      report,
    })

    const responseBody: ICreateServiceControllerResponse = {
      id: createServiceUseCaseReturn.id,
      orderItemId: createServiceUseCaseReturn.orderItemId,
      employeeId: createServiceUseCaseReturn.employeeId,
      status: createServiceUseCaseReturn.status,
      report: createServiceUseCaseReturn.report,
    }

    return reply.status(201).send(responseBody)
  } catch (error) {
    if (error instanceof OrderItemNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }
    if (error instanceof EmployeeNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }
    throw error
  }
}

export { createServiceController }
