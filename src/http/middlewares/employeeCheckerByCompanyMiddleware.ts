import { FastifyReply, FastifyRequest } from 'fastify'

import { MiddlewareError } from '@/errors/middlewareError'
import { EmployeeRepository } from '@/repositories/employee/employeeRepository'
import { CompanyRepository } from '@/repositories/company/companyRepository'
import { AccountTypeEnum } from '@/enums/all.enum'
import { ISimpleEmployeeDTO } from '@/dtos/employee/ISimpleEmployeeDTO'
import { translate } from '@/i18n/translate'
import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'

const employeeCheckerByCompanyMiddleware = async (
  request: FastifyRequest,
  _reply: FastifyReply,
) => {
  const { id: companyId } = request.company

  const { id: employeeId } = ISimpleEmployeeDTO.parse(request.params)

  const employeeRepository = new EmployeeRepository()
  const searchedEmployee = await employeeRepository.findById(employeeId)

  if (!searchedEmployee) {
    throw new MiddlewareError({
      statusCode: 404,
      message: translate(TranslationKeysEnum.ERROR_EMPLOYEE_NOT_FOUND),
      name: TranslationKeysEnum.ERROR_EMPLOYEE_NOT_FOUND,
    })
  }

  const companyRepository = new CompanyRepository()
  const searchedCompany = await companyRepository.findById(companyId)

  if (
    searchedEmployee.companyId !== companyId &&
    searchedCompany?.accountType !== AccountTypeEnum.ADMIN
  ) {
    throw new MiddlewareError({
      statusCode: 401,
      message: translate(TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED),
      name: TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED,
    })
  }
}

export { employeeCheckerByCompanyMiddleware }
