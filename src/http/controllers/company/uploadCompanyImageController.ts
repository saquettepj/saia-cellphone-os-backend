import { FastifyReply, FastifyRequest } from 'fastify'
import { Company } from '@prisma/client'

import { PutImageOnBucketError } from '@/errors/putImageOnBucketError'
import { UploadedContentEmptyError } from '@/errors/uploadedContentEmptyError'
import { UploadedContentWrongFormatError } from '@/errors/uploadedContentWrongFormatError'
import { RequestParamsNotReachedError } from '@/errors/requestParamsNotReachedError'
import { setupUploadCompanyImageUseCase } from '@/useCases/company/factory/setupUploadCompanyImageUseCase'

interface IUploadCompanyImageControllerResponse {
  company: Company | null
}

async function uploadCompanyImageController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.company
  const { buffer, mimetype } = request.file

  try {
    const uploadCompanyImageUseCase = setupUploadCompanyImageUseCase()
    const uploadCompanyImageUseCaseReturn =
      await uploadCompanyImageUseCase.execute({
        id,
        buffer,
        contentType: mimetype,
        url: request.url,
      })

    const responseBody: IUploadCompanyImageControllerResponse = {
      company: uploadCompanyImageUseCaseReturn.company,
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    if (error instanceof UploadedContentEmptyError) {
      return reply.status(400).send({ message: error.message })
    }
    if (error instanceof UploadedContentWrongFormatError) {
      return reply.status(400).send({ message: error.message })
    }
    if (error instanceof PutImageOnBucketError) {
      return reply.status(400).send({ message: error.message })
    }
    if (error instanceof RequestParamsNotReachedError) {
      return reply.status(404).send({ message: error.message })
    }
  }
}

export { uploadCompanyImageController }
