import { EmployeeNotFoundError } from '@/errors/employeeNotFoundError'
import { IEmployeeRepository } from '@/repositories/employee/IEmployeeRepository'

interface IGetEmployeeUseCaseRequest {
  companyId: string
  id?: string
  name?: string
  CPF?: string
  phone?: string
  role?: string
}

class GetEmployeeUseCase {
  constructor(private employeeRepository: IEmployeeRepository) {}

  async execute({
    companyId,
    id,
    name,
    CPF,
    phone,
    role,
  }: IGetEmployeeUseCaseRequest) {
    const employees = await this.employeeRepository.findAllByCompanyId(
      companyId,
      {
        id,
        name,
        CPF,
        phone,
        role,
      },
    )

    if (!employees || employees.length === 0) {
      throw new EmployeeNotFoundError()
    }

    return employees
  }
}

export { GetEmployeeUseCase, IGetEmployeeUseCaseRequest }
