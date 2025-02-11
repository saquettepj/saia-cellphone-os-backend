import { FastifyReply, FastifyRequest } from 'fastify'

import { setupGetNfeDataUseCase } from '@/useCases/nfeData/factory/setupGetNfeDataUseCase'
import { NfeConfigurationNotFoundError } from '@/errors/nfeConfigurationNotFoundError'

interface IGetNfeDataControllerResponse {
  id: string
  companyId: string
  serializedCertificatePFX: string
  certificatePasswordEncrypt: string
  idCSC: string
  CSC: string
  IE: string
  IM: string
  lastNNF: string
}

async function getNfeDataController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { id: companyId } = request.company

    const getNfeDataUseCase = setupGetNfeDataUseCase()

    const nfeData = await getNfeDataUseCase.execute({
      companyId,
    })

    const responseBody: IGetNfeDataControllerResponse = {
      id: nfeData.id,
      companyId: nfeData.companyId,
      serializedCertificatePFX: nfeData.serializedCertificatePFX,
      certificatePasswordEncrypt: nfeData.certificatePasswordEncrypt,
      idCSC: nfeData.idCSC,
      CSC: nfeData.CSC,
      IE: nfeData.IE,
      IM: nfeData.IM,
      lastNNF: nfeData.lastNNF,
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    if (error instanceof NfeConfigurationNotFoundError) {
      return reply.status(400).send({
        message: error.message,
        name: error.name,
      })
    }
    return reply.status(500).send()
  }
}

export { getNfeDataController }
