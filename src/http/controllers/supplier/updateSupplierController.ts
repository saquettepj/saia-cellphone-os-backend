import { FastifyReply, FastifyRequest } from 'fastify'

import { ISimpleSupplierDTO } from '@/dtos/supplier/ISimpleSupplierDTO'
import { IUpdateSupplierDTO } from '@/dtos/supplier/IUpdateSupplierDTO'
import { setupUpdateSupplierUseCase } from '@/useCases/supplier/factory/setupUpdateSupplierUseCase'
import { CNPJAlreadyExistsError } from '@/errors/CNPJAlreadyExistsError'
import { EmailAlreadyExistsError } from '@/errors/emailAlreadyExistsError'

interface IUpdateSupplierControllerResponse {
  id: string
  name: string
  CNPJ: string
  CEP: string
  email: string | null
  phone: string | null
}

async function updateSupplierController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id: companyId } = request.company

  const { id } = ISimpleSupplierDTO.parse(request.params)
  const { name, CNPJ, CEP, email, phone } = IUpdateSupplierDTO.parse(
    request.body,
  )

  try {
    const updateSupplierUseCase = setupUpdateSupplierUseCase()
    const updateSupplierUseCaseReturn = await updateSupplierUseCase.execute({
      companyId,
      id,
      name,
      CNPJ,
      CEP,
      email,
      phone,
    })

    const responseBody: IUpdateSupplierControllerResponse = {
      id: updateSupplierUseCaseReturn.id,
      name: updateSupplierUseCaseReturn.name,
      CNPJ: updateSupplierUseCaseReturn.CNPJ,
      CEP: updateSupplierUseCaseReturn.CEP,
      email: updateSupplierUseCaseReturn.email,
      phone: updateSupplierUseCaseReturn.phone,
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    if (error instanceof CNPJAlreadyExistsError) {
      return reply
        .status(409)
        .send({ message: error.message, name: error.name })
    }

    if (error instanceof EmailAlreadyExistsError) {
      return reply
        .status(409)
        .send({ message: error.message, name: error.name })
    }

    throw error
  }
}

export { updateSupplierController }
