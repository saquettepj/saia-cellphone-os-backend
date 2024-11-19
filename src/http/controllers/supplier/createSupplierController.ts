import { FastifyReply, FastifyRequest } from 'fastify'

import { ICreateSupplierDTO } from '@/dtos/supplier/ICreateSupplierDTO'
import { setupCreateSupplierUseCase } from '@/useCases/supplier/factory/setupCreateSupplierUseCase'
import { EmailAlreadyExistsError } from '@/errors/emailAlreadyExistsError'
import { CNPJAlreadyExistsError } from '@/errors/CNPJAlreadyExistsError'

interface ICreateSupplierControllerResponse {
  id: string
  companyId: string
  name: string
  CNPJ: string
  CEP: string
  email: string | null
  phone: string | null
}

async function createSupplierController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id: companyId } = request.company

  const { name, CNPJ, CEP, email, phone } = ICreateSupplierDTO.parse(
    request.body,
  )

  try {
    const createSupplierUseCase = setupCreateSupplierUseCase()
    const createSupplierUseCaseReturn = await createSupplierUseCase.execute({
      companyId,
      name,
      CNPJ,
      CEP,
      email,
      phone,
    })

    const responseBody: ICreateSupplierControllerResponse = {
      id: createSupplierUseCaseReturn.id,
      companyId: createSupplierUseCaseReturn.companyId,
      name: createSupplierUseCaseReturn.name,
      CNPJ: createSupplierUseCaseReturn.CNPJ,
      CEP: createSupplierUseCaseReturn.CEP,
      email: createSupplierUseCaseReturn.email,
      phone: createSupplierUseCaseReturn.phone,
    }

    return reply.status(201).send(responseBody)
  } catch (error) {
    if (error instanceof CNPJAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    if (error instanceof EmailAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}

export { createSupplierController }
