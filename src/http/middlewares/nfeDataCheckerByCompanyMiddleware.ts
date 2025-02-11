import { FastifyReply, FastifyRequest } from 'fastify'

import { MiddlewareError } from '@/errors/middlewareError'
import { translate } from '@/i18n/translate'
import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { NfeDataRepository } from '@/repositories/nfeData/nfeDataRepository'

const nfeDataCheckerByCompanyMiddleware = async (
  request: FastifyRequest,
  _reply: FastifyReply,
) => {
  const { id: companyId } = request.company

  const nfeDataRepository = new NfeDataRepository()
  const searchedNfeData = await nfeDataRepository.findOneByCompanyId(companyId)

  if (!searchedNfeData) {
    throw new MiddlewareError({
      statusCode: 404,
      message: translate(
        TranslationKeysEnum.ERROR_INVOICE_CONFIGURATION_REQUIRED,
      ),
      name: TranslationKeysEnum.ERROR_INVOICE_CONFIGURATION_REQUIRED,
    })
  }
}

export { nfeDataCheckerByCompanyMiddleware }
