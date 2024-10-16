import { CreateEmployeeUseCase } from '@/useCases/employee/createEmployeeUseCase'
import { EmployeeRepository } from '@/repositories/employee/employeeRepository'

export const setupCreateEmployeeUseCase = () => {
  const employeeRepository = new EmployeeRepository()
  return new CreateEmployeeUseCase(employeeRepository)
}
