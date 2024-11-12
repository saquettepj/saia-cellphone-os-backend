import { FastifyReply, FastifyRequest } from 'fastify'
import { verify } from 'jsonwebtoken'

import { env } from '@/env'
import { MiddlewareError } from '@/errors/middlewareError'
import { CompanyRepository } from '@/repositories/company/companyRepository'
import { translate } from '@/i18n/translate'
import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'

interface IPayLoad {
  sub: string
}

const companyAuthenticatorMiddleware = async (
  request: FastifyRequest,
  _reply: FastifyReply,
) => {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new MiddlewareError({
      message: translate(TranslationKeysEnum.ERROR_TOKEN_MISSING),
      statusCode: 401,
      name: TranslationKeysEnum.ERROR_TOKEN_MISSING,
    })
  }

  const [, token] = authHeader.split(' ')

  const companyRepository = new CompanyRepository()

  try {
    const { sub: id } = verify(token, env.SESSION_TOKEN) as IPayLoad

    const searchedUser = await companyRepository.findById(id)

    if (!searchedUser) {
      throw new MiddlewareError({
        message: translate(TranslationKeysEnum.ERROR_INVALID_TOKEN),
        statusCode: 401,
        name: TranslationKeysEnum.ERROR_INVALID_TOKEN,
      })
    }

    request.company = { id, name: searchedUser.name }
  } catch {
    throw new MiddlewareError({
      message: translate(TranslationKeysEnum.ERROR_INVALID_TOKEN),
      statusCode: 401,
      name: TranslationKeysEnum.ERROR_INVALID_TOKEN,
    })
  }
}

export { companyAuthenticatorMiddleware }
