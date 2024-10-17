import { IEmployeeRepository } from '@/repositories/employee/IEmployeeRepository'

interface IDeleteEmployeeUseCaseRequest {
  id: string
}

class DeleteEmployeeUseCase {
  constructor(private employeeRepository: IEmployeeRepository) {}

  async execute({ id }: IDeleteEmployeeUseCaseRequest) {
    await this.employeeRepository.delete(id)
  }
}

export { DeleteEmployeeUseCase, IDeleteEmployeeUseCaseRequest }
