import { FastifyReply, FastifyRequest } from 'fastify'

import { ISimpleNfeDataDTO } from '@/dtos/nfeData/ISimpleNfeDataDTO'
import { IUpdateNfeDataDTO } from '@/dtos/nfeData/IUpdateNfeDataDTO'
import { setupUpdateNfeDataUseCase } from '@/useCases/nfeData/factory/setupUpdateNfeDataUseCase'

interface IUpdateNfeDataControllerResponse {
  id: string
  companyId: string
  inscricaoEstadual: string
  regimeTributario: string
  codigoRegimeTributario: string
  cnae: string
  idCSC: string
  CSC: string
}

async function updateNfeDataController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = ISimpleNfeDataDTO.parse(request.params)

  const { inscricaoEstadual, regimeTributario, cnae, idCSC, CSC } =
    IUpdateNfeDataDTO.parse(request.body)

  try {
    const updateNfeDataUseCase = setupUpdateNfeDataUseCase()

    const updateNfeDataUseCaseReturn = await updateNfeDataUseCase.execute({
      id,
      inscricaoEstadual,
      regimeTributario,
      cnae,
      idCSC,
      CSC,
    })

    const responseBody: IUpdateNfeDataControllerResponse = {
      id: updateNfeDataUseCaseReturn.id,
      companyId: updateNfeDataUseCaseReturn.companyId,
      inscricaoEstadual: updateNfeDataUseCaseReturn.inscricaoEstadual,
      regimeTributario: updateNfeDataUseCaseReturn.regimeTributario,
      codigoRegimeTributario: updateNfeDataUseCaseReturn.codigoRegimeTributario,
      cnae: updateNfeDataUseCaseReturn.cnae,
      idCSC: updateNfeDataUseCaseReturn.idCSC,
      CSC: updateNfeDataUseCaseReturn.CSC,
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    throw error
  }
}

export { updateNfeDataController }
