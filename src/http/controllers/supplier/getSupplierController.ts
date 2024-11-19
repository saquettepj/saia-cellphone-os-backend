import { FastifyReply, FastifyRequest } from 'fastify'

import { IGetSupplierDTO } from '@/dtos/supplier/IGetSupplierDTO'
import { setupGetSupplierUseCase } from '@/useCases/supplier/factory/setupGetSupplierUseCase'

interface IGetSupplierControllerResponse {
  id: string
  companyId: string
  name: string
  CNPJ: string
  CEP: string
  email: string | null
  phone: string | null
}

async function getSupplierController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id: companyId } = request.company

  const { name, CNPJ, CEP, email, phone } = IGetSupplierDTO.parse(request.body)

  try {
    const getSupplierUseCase = setupGetSupplierUseCase()

    const getSupplierUseCaseReturn = await getSupplierUseCase.execute({
      companyId,
      name,
      CNPJ,
      CEP,
      email,
      phone,
    })

    const responseBody: IGetSupplierControllerResponse[] =
      getSupplierUseCaseReturn.map((supplier) => ({
        id: supplier.id,
        companyId: supplier.companyId,
        name: supplier.name,
        CNPJ: supplier.CNPJ,
        CEP: supplier.CEP,
        email: supplier.email,
        phone: supplier.phone,
      }))

    return reply.status(200).send(responseBody)
  } catch (error) {
    throw error
  }
}

export { getSupplierController }
