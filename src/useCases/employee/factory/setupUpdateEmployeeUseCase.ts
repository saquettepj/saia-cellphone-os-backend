import { UpdateEmployeeUseCase } from '@/useCases/employee/updateEmployeeUseCase'
import { EmployeeRepository } from '@/repositories/employee/employeeRepository'

export const setupUpdateEmployeeUseCase = () => {
  const employeeRepository = new EmployeeRepository()
  return new UpdateEmployeeUseCase(employeeRepository)
}
