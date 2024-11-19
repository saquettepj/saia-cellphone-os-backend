import { FastifyReply, FastifyRequest } from 'fastify'

import { ISimpleServiceDTO } from '@/dtos/service/ISimpleServiceDTO'
import { MiddlewareError } from '@/errors/middlewareError'
import { ServiceRepository } from '@/repositories/service/serviceRepository'
import { translate } from '@/i18n/translate'
import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { EmployeeRepository } from '@/repositories/employee/employeeRepository'

const serviceCheckerByCompanyMiddleware = async (
  request: FastifyRequest,
  _reply: FastifyReply,
) => {
  const { id } = request.company

  const { id: serviceId } = ISimpleServiceDTO.parse(request.params)

  const serviceRepository = new ServiceRepository()
  const searchedService = await serviceRepository.findById(serviceId)

  if (!searchedService) {
    throw new MiddlewareError({
      statusCode: 404,
      message: translate(TranslationKeysEnum.ERROR_SERVICE_NOT_FOUND),
      name: TranslationKeysEnum.ERROR_SERVICE_NOT_FOUND,
    })
  }

  if (searchedService.employeeId) {
    const employeeRepository = new EmployeeRepository()
    const searchedEmployee = await employeeRepository.findById(
      searchedService.employeeId,
    )

    if (!searchedEmployee || searchedEmployee.companyId !== id) {
      throw new MiddlewareError({
        statusCode: 401,
        message: translate(TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED),
        name: TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED,
      })
    }
  }
}

export { serviceCheckerByCompanyMiddleware }
