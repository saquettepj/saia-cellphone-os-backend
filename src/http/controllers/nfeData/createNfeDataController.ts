import { FastifyReply, FastifyRequest } from 'fastify'

import { ICreateNfeDataDTO } from '@/dtos/nfeData/ICreateNfeDataDTO'
import { setupCreateNfeDataUseCase } from '@/useCases/nfeData/factory/setupCreateNfeDataUseCase'
import { OnlyOneEntityError } from '@/errors/onlyOneEntityError'

interface ICreateNfeDataControllerResponse {
  id: string
  companyId: string
  inscricaoEstadual: string
  regimeTributario: string
  codigoRegimeTributario: string
  cnae: string
  idCSC: string
  CSC: string
}

async function createNfeDataController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id: companyId } = request.company

  const { inscricaoEstadual, regimeTributario, cnae, idCSC, CSC } =
    ICreateNfeDataDTO.parse(request.body)

  try {
    const createNfeDataUseCase = setupCreateNfeDataUseCase()

    const createNfeDataUseCaseReturn = await createNfeDataUseCase.execute({
      companyId,
      inscricaoEstadual,
      regimeTributario,
      cnae,
      idCSC,
      CSC,
    })

    const responseBody: ICreateNfeDataControllerResponse = {
      id: createNfeDataUseCaseReturn.id,
      companyId: createNfeDataUseCaseReturn.companyId,
      inscricaoEstadual: createNfeDataUseCaseReturn.inscricaoEstadual,
      regimeTributario: createNfeDataUseCaseReturn.regimeTributario,
      codigoRegimeTributario: createNfeDataUseCaseReturn.codigoRegimeTributario,
      cnae: createNfeDataUseCaseReturn.cnae,
      idCSC: createNfeDataUseCaseReturn.idCSC,
      CSC: createNfeDataUseCaseReturn.CSC,
    }

    return reply.status(201).send(responseBody)
  } catch (error) {
    if (error instanceof OnlyOneEntityError) {
      return reply.status(400).send({ message: error.message })
    }
    throw error
  }
}

export { createNfeDataController }
