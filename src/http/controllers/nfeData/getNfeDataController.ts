import { FastifyReply, FastifyRequest } from 'fastify'

import { IGetNfeDataDTO } from '@/dtos/nfeData/IGetNfeDataDTO'
import { setupGetNfeDataUseCase } from '@/useCases/nfeData/factory/setupGetNfeDataUseCase'

interface IGetNfeDataControllerResponse {
  nfeData: Array<{
    id: string
    inscricaoEstadual: string
    regimeTributario: string
    codigoRegimeTributario: string
    cnae: string
    idCSC: string
    CSC: string
  }>
}

async function getNfeDataController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id: companyId } = request.company

  const {
    id,
    inscricaoEstadual,
    regimeTributario,
    codigoRegimeTributario,
    cnae,
  } = IGetNfeDataDTO.parse(request.body)

  try {
    const getNfeDataUseCase = setupGetNfeDataUseCase()

    const getNfeDataUseCaseReturn = await getNfeDataUseCase.execute({
      companyId,
      id,
      inscricaoEstadual,
      regimeTributario,
      codigoRegimeTributario,
      cnae,
    })

    const responseBody: IGetNfeDataControllerResponse = {
      nfeData: getNfeDataUseCaseReturn.map((nfeData) => ({
        id: nfeData.id,
        inscricaoEstadual: nfeData.inscricaoEstadual,
        regimeTributario: nfeData.regimeTributario,
        codigoRegimeTributario: nfeData.codigoRegimeTributario,
        cnae: nfeData.cnae,
        idCSC: nfeData.idCSC,
        CSC: nfeData.CSC,
      })),
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    throw error
  }
}

export { getNfeDataController }
