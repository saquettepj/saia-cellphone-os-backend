import { IEmployeeRepository } from '@/repositories/employee/IEmployeeRepository'
import { EmployeeNotFoundError } from '@/errors/employeeNotFoundError'

interface IUpdateEmployeeUseCaseRequest {
  id: string
  name?: string
  CPF?: string
  phone?: string
  role?: string
}

class UpdateEmployeeUseCase {
  constructor(private employeeRepository: IEmployeeRepository) {}

  async execute({ id, name, CPF, phone, role }: IUpdateEmployeeUseCaseRequest) {
    const existingEmployee = await this.employeeRepository.findById(id)

    if (!existingEmployee) {
      throw new EmployeeNotFoundError()
    }

    const updatedEmployee = await this.employeeRepository.updateById(id, {
      name,
      CPF,
      phone,
      role,
    })

    return updatedEmployee
  }
}

export { UpdateEmployeeUseCase, IUpdateEmployeeUseCaseRequest }
