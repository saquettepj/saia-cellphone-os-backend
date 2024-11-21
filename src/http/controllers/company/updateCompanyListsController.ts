import { FastifyReply, FastifyRequest } from 'fastify'

import { IUpdateCompanyListsDTO } from '@/dtos/company/IUpdateCompanyListsDTO'
import { setupUpdateCompanyListsUseCase } from '@/useCases/company/factory/setupUpdateCompanyListsUseCase'

interface IUpdateCompanyControllerResponse {
  lists: string[]
}

async function updateCompanyListsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.company
  const { lists } = IUpdateCompanyListsDTO.parse(request.body)

  try {
    const updateCompanyListsUseCase = setupUpdateCompanyListsUseCase()

    const updateCompanyListsUseCaseReturn =
      await updateCompanyListsUseCase.execute({ id, lists })

    const responseBody: IUpdateCompanyControllerResponse = {
      lists: updateCompanyListsUseCaseReturn.lists,
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    throw error
  }
}

export { updateCompanyListsController }
