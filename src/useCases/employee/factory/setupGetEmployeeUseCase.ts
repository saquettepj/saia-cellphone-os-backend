import { GetEmployeeUseCase } from '@/useCases/employee/getEmployeeUseCase'
import { EmployeeRepository } from '@/repositories/employee/employeeRepository'

export const setupGetEmployeeUseCase = () => {
  const employeeRepository = new EmployeeRepository()
  return new GetEmployeeUseCase(employeeRepository)
}
