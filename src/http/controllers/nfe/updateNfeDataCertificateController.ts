import { FastifyReply, FastifyRequest } from 'fastify'
import multer from 'fastify-multer'

import { IUpdateNfeDataCertificateDTO } from '@/dtos/nfe/IUpdateNfeDataCertificateDTO'
import { setupUpdateNfeDataCertificateUseCase } from '@/useCases/nfeData/factory/setupUpdateNfeDataCertificateUseCase'
import { FileNotUploadedError } from '@/errors/fileNotUploadedError'

const upload = multer({ storage: multer.memoryStorage() })

interface IUpdateNfeDataCertificateControllerResponse {
  id: string
  companyId: string
}

async function updateNfeDataCertificateController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id, certificateKey } = IUpdateNfeDataCertificateDTO.parse(
    request.body,
  )
  const file = request.file

  if (!file || !file.buffer) {
    throw new FileNotUploadedError()
  }

  try {
    const serializedCertificate = file.buffer.toString('base64')
    const updateNfeDataCertificateUseCase =
      setupUpdateNfeDataCertificateUseCase()
    const updateNfeDataCertificateUseCaseResult =
      await updateNfeDataCertificateUseCase.execute({
        id,
        certificateKey,
        serializedCertificate,
      })

    const responseBody: IUpdateNfeDataCertificateControllerResponse = {
      id: updateNfeDataCertificateUseCaseResult.id,
      companyId: updateNfeDataCertificateUseCaseResult.companyId,
    }

    return reply.status(200).send(responseBody)
  } catch (error) {}
}

export { updateNfeDataCertificateController, upload }
