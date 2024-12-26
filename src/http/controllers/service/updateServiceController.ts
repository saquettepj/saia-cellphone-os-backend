import { FastifyReply, FastifyRequest } from 'fastify'

import { ISimpleServiceDTO } from '@/dtos/service/ISimpleServiceDTO'
import { IUpdateServiceDTO } from '@/dtos/service/IUpdateServiceDTO'
import { setupUpdateServiceUseCase } from '@/useCases/service/factory/setupUpdateServiceUseCase'
import { OrderItemNotFoundError } from '@/errors/orderItemNotFoundError'
import { EmployeeNotFoundError } from '@/errors/employeeNotFoundError'
import { OrderNotFoundError } from '@/errors/orderNotFoundError'

interface IUpdateServiceControllerResponse {
  id: string
  orderItemId: string | null
  employeeId: string | null
  status: string | null
  report?: string | null
}

async function updateServiceController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = ISimpleServiceDTO.parse(request.params)

  const { orderItemId, employeeId, status, report } = IUpdateServiceDTO.parse(
    request.body,
  )

  try {
    const updateServiceUseCase = setupUpdateServiceUseCase()

    const updateServiceUseCaseReturn = await updateServiceUseCase.execute({
      id,
      orderItemId,
      employeeId,
      status,
      report,
    })

    const responseBody: IUpdateServiceControllerResponse = {
      id: updateServiceUseCaseReturn.id,
      orderItemId: updateServiceUseCaseReturn.orderItemId,
      employeeId: updateServiceUseCaseReturn.employeeId,
      status: updateServiceUseCaseReturn.status,
      report: updateServiceUseCaseReturn.report,
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    if (error instanceof OrderItemNotFoundError) {
      return reply
        .status(404)
        .send({ message: error.message, name: error.name })
    }
    if (error instanceof EmployeeNotFoundError) {
      return reply
        .status(404)
        .send({ message: error.message, name: error.name })
    }
    if (error instanceof OrderNotFoundError) {
      return reply
        .status(404)
        .send({ message: error.message, name: error.name })
    }
    throw error
  }
}

export { updateServiceController }
