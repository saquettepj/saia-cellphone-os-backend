import { IEmployeeRepository } from '@/repositories/employee/IEmployeeRepository'
import { EmployeeNotFoundError } from '@/errors/employeeNotFoundError'

interface IDeleteEmployeeUseCaseRequest {
  id: string
}

class DeleteEmployeeUseCase {
  constructor(private employeeRepository: IEmployeeRepository) {}

  async execute({ id }: IDeleteEmployeeUseCaseRequest) {
    const existingEmployee = await this.employeeRepository.findById(id)

    if (!existingEmployee) {
      throw new EmployeeNotFoundError()
    }

    await this.employeeRepository.delete(id)
  }
}

export { DeleteEmployeeUseCase, IDeleteEmployeeUseCaseRequest }
