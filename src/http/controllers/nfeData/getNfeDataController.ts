import { FastifyReply, FastifyRequest } from 'fastify'

import { setupGetNfeDataUseCase } from '@/useCases/nfeData/factory/setupGetNfeDataUseCase'

interface IGetNfeDataControllerResponse {
  id: string
  companyId: string
  serializedCertificatePFX: string
  certificatePasswordEncrypt: string
  idCSC: string
  CSC: string
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
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    return reply.status(500).send()
  }
}

export { getNfeDataController }
