import { FastifyReply, FastifyRequest } from 'fastify'

import { IGetClientNameByCPFDTO } from '@/dtos/external/IGetClientNameByCPFDTO'
import { setupGetClientNameByCPFUseCase } from '@/useCases/external/factory/setupGetClientNameByCPFUseCase'
import { ClientNameNotFoundError } from '@/errors/clientNameNotFoundError'

interface IGetClientNameByCPFControllerResponse {
  name: string
}

async function getClientNameByCPFController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { CPF } = IGetClientNameByCPFDTO.parse(request.params)

  try {
    const getClientNameByCPFUseCase = setupGetClientNameByCPFUseCase()

    const getClientNameByCPFUseCaseReturn =
      await getClientNameByCPFUseCase.execute({
        CPF,
      })

    const responseBody: IGetClientNameByCPFControllerResponse = {
      name: getClientNameByCPFUseCaseReturn.name,
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    if (error instanceof ClientNameNotFoundError) {
      return reply
        .status(400)
        .send({ message: error.message, name: error.name })
    }
  }
}

export { getClientNameByCPFController }
