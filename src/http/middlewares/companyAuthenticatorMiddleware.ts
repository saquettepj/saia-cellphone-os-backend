import { FastifyReply, FastifyRequest } from 'fastify'
import { verify } from 'jsonwebtoken'

import { env } from '@/env'
import { MiddlewareError } from '@/errors/middlewareError'
import { CompanyRepository } from '@/repositories/company/companyRepository'

interface IPayLoad {
  sub: string
}

const companyAuthenticatorMiddleware = async (
  request: FastifyRequest,
  _reply: FastifyReply,
) => {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new MiddlewareError({ message: 'Token missing!', statusCode: 401 })
  }

  const [, token] = authHeader.split(' ')

  const companyRepository = new CompanyRepository()

  try {
    const { sub: id } = verify(token, env.SESSION_TOKEN) as IPayLoad

    const searchedUser = await companyRepository.findById(id)

    if (!searchedUser) {
      throw new MiddlewareError({ message: 'Invalid token!', statusCode: 401 })
    }

    request.company = { id, name: searchedUser.name }
  } catch {
    throw new MiddlewareError({ message: 'Invalid token!', statusCode: 401 })
  }
}

export { companyAuthenticatorMiddleware }
