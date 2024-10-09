import { FastifyReply, FastifyRequest } from 'fastify'

import { ISimpleCompanyDTO } from '@/dtos/company/ISimpleCompanyDTO'
import { DeleteImageOnBucketError } from '@/errors/deleteImageOnBucketError'
import { CompanyNotFoundError } from '@/errors/companyNotFoundError'
import { setupDeleteCompanyUseCase } from '@/useCases/company/factory/setupDeleteCompanyUseCase'

interface IDeleteCompanyControllerResponse {
  companyId: string
  productsIds: string[]
  imageNames: string[]
}

async function deleteCompanyController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = ISimpleCompanyDTO.parse(request.params)

  try {
    const deleteCompanyUseCase = setupDeleteCompanyUseCase()

    const deleteCompanyUseCaseReturn = await deleteCompanyUseCase.execute({
      id,
    })

    const responseBody: IDeleteCompanyControllerResponse = {
      companyId: id,
      productsIds: deleteCompanyUseCaseReturn.productsIds,
      imageNames: deleteCompanyUseCaseReturn.imageNames,
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    if (error instanceof DeleteImageOnBucketError) {
      return reply.status(403).send({ message: error.message })
    }

    if (error instanceof CompanyNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }
  }
}

export { deleteCompanyController }
