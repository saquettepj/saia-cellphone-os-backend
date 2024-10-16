import { CPFAlreadyExistsError } from '@/errors/CPFAlreadyExistsError'
import { IEmployeeRepository } from '@/repositories/employee/IEmployeeRepository'

interface ICreateEmployeeUseCaseRequest {
  name: string
  CPF: string
  phone?: string
  role: string
  companyId: string
}

class CreateEmployeeUseCase {
  constructor(private employeeRepository: IEmployeeRepository) {}

  async execute({
    name,
    CPF,
    phone,
    role,
    companyId,
  }: ICreateEmployeeUseCaseRequest) {
    const employeeWithSameCPF = await this.employeeRepository.findByCPF(CPF)

    if (employeeWithSameCPF) {
      throw new CPFAlreadyExistsError()
    }

    const employee = await this.employeeRepository.create({
      name,
      CPF,
      phone,
      role,
      companyId,
    })

    return employee
  }
}

export { CreateEmployeeUseCase, ICreateEmployeeUseCaseRequest }
