import { FastifyReply, FastifyRequest } from 'fastify'

import { MiddlewareError } from '@/errors/middlewareError'
import { EmployeeRepository } from '@/repositories/employee/employeeRepository'
import { CompanyRepository } from '@/repositories/company/companyRepository'
import { AccountTypeEnum } from '@/enums/all.enum'
import { ICheckerEmployeeDTO } from '@/dtos/employee/ICheckerEmployeeDTO'

const employeeCheckerByCompanyMiddleware = async (
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
      message: 'Employee not found!',
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
      message: 'Not Allowed!',
    })
  }
}

export { employeeCheckerByCompanyMiddleware }
