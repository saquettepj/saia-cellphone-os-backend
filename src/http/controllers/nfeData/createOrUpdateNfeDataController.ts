import { FastifyReply, FastifyRequest } from 'fastify'
import multer from 'fastify-multer'

import { ICreateOrUpdateNfeDataDTO } from '@/dtos/nfeData/ICreateOrUpdateNfeDataDTO'
import { setupCreateOrUpdateNfeDataUseCase } from '@/useCases/nfeData/factory/setupCreateOrUpdateNfeDataUseCase'
import { FileNotUploadedError } from '@/errors/fileNotUploadedError'
import { WrongFilePFXFormatError } from '@/errors/wrongFilePFXFormatError'

const upload = multer({ storage: multer.memoryStorage() })

interface ICreateOrUpdateNfeDataControllerResponse {
  id: string
  companyId: string
  serializedCertificatePFX: string
  certificatePasswordEncrypt: string
  idCSC: string
  CSC: string
}

async function createOrUpdateNfeDataController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { id: companyId } = request.company

    const { certificatePassword, idCSC, CSC } = ICreateOrUpdateNfeDataDTO.parse(
      request.body,
    )

    const file = request.file

    if (!file || !file.buffer) {
      throw new FileNotUploadedError()
    }

    if (file.mimetype !== 'application/x-pkcs12') {
      throw new WrongFilePFXFormatError()
    }

    const serializedCertificatePFX = file.buffer.toString('base64')

    const createOrUpdateNfeDataUseCase = setupCreateOrUpdateNfeDataUseCase()

    const createOrUpdateNfeDataReturn =
      await createOrUpdateNfeDataUseCase.execute({
        companyId,
        serializedCertificatePFX,
        certificatePassword,
        idCSC,
        CSC,
      })

    const responseBody: ICreateOrUpdateNfeDataControllerResponse = {
      id: createOrUpdateNfeDataReturn.id,
      companyId: createOrUpdateNfeDataReturn.companyId,
      serializedCertificatePFX:
        createOrUpdateNfeDataReturn.serializedCertificatePFX,
      certificatePasswordEncrypt:
        createOrUpdateNfeDataReturn.certificatePasswordEncrypt,
      idCSC: createOrUpdateNfeDataReturn.idCSC,
      CSC: createOrUpdateNfeDataReturn.CSC,
    }

    return reply.status(201).send(responseBody)
  } catch (error) {
    if (error instanceof FileNotUploadedError) {
      return reply.status(400).send({
        message: error.message,
        name: error.name,
      })
    }

    if (error instanceof WrongFilePFXFormatError) {
      return reply.status(400).send({
        message: error.message,
        name: error.name,
      })
    }

    throw error
  }
}

export { createOrUpdateNfeDataController, upload }
