import { FastifyReply, FastifyRequest } from 'fastify'
import { Company } from '@prisma/client'

import { RequestParamsNotReachedError } from '@/errors/requestParamsNotReachedError'
import { ImageNotFoundError } from '@/errors/imageNotFoundError'
import { RequestFormattingError } from '@/errors/requestFormattingError'
import { setupRemoveUploadedCompanyImageUseCase } from '@/useCases/company/factory/setupRemoveUploadedCompanyImageUseCase'

interface IRemoveUploadedCompanyImageControllerResponse {
  company: Company | null
}

async function removeUploadedCompanyImageController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.company
  const { url } = request

  try {
    const removeUploadedCompanyImageUseCase =
      setupRemoveUploadedCompanyImageUseCase()

    const removeUploadedCompanyImageUseCaseReturn =
      await removeUploadedCompanyImageUseCase.execute({
        id,
        url,
      })

    const responseBody: IRemoveUploadedCompanyImageControllerResponse =
      removeUploadedCompanyImageUseCaseReturn

    return reply.status(200).send(responseBody)
  } catch (error) {
    if (error instanceof ImageNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }
    if (error instanceof RequestFormattingError) {
      return reply.status(400).send({ message: error.message })
    }
    if (error instanceof RequestParamsNotReachedError) {
      return reply.status(404).send({ message: error.message })
    }
  }
}

export { removeUploadedCompanyImageController }
