import { DeleteEmployeeUseCase } from '@/useCases/employee/deleteEmployeeUseCase'
import { EmployeeRepository } from '@/repositories/employee/employeeRepository'

export const setupDeleteEmployeeUseCase = () => {
  const employeeRepository = new EmployeeRepository()
  return new DeleteEmployeeUseCase(employeeRepository)
}
