import { FastifyReply, FastifyRequest } from 'fastify'

import { MiddlewareError } from '@/errors/middlewareError'
import { EmployeeRepository } from '@/repositories/employee/employeeRepository'
import { CompanyRepository } from '@/repositories/company/companyRepository'
import { AccountTypeEnum } from '@/enums/all.enum'
import { ICheckerEmployeeDTO } from '@/dtos/employee/ICheckerEmployeeDTO'
import { translate } from '@/i18n/translate'
import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'

const employeeOnOthersCheckerByCompanyMiddleware = async (
  request: FastifyRequest,
  _reply: FastifyReply,
) => {
  const { id: companyId } = request.company

  const { employeeId } = ICheckerEmployeeDTO.parse(request.body)

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

export { employeeOnOthersCheckerByCompanyMiddleware }
