import { FastifyReply, FastifyRequest } from 'fastify'

import { setupGetServiceUseCase } from '@/useCases/service/factory/setupGetServiceUseCase'
import { IGetServiceDTO } from '@/dtos/service/IGetServiceDTO'

interface IGetServiceControllerResponse {
  services: Array<{
    id: string
    orderItemId: string
    employeeId: string
    status: string
    report?: string | null
  }>
}

async function getServiceController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id, orderItemId, employeeId, status, report } = IGetServiceDTO.parse(
    request.body,
  )

  try {
    const getServiceUseCase = setupGetServiceUseCase()

    const getServiceUseCaseReturn = await getServiceUseCase.execute({
      id,
      orderItemId,
      employeeId,
      status,
      report,
    })

    const responseBody: IGetServiceControllerResponse = {
      services: getServiceUseCaseReturn,
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    throw error
  }
}

export { getServiceController }
