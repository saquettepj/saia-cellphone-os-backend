import { CPFAlreadyExistsError } from '@/errors/CPFAlreadyExistsError'
import { IEmployeeRepository } from '@/repositories/employee/IEmployeeRepository'

interface IUpdateEmployeeUseCaseRequest {
  companyId: string
  id: string
  name?: string
  CPF?: string
  phone?: string
  role?: string
}

class UpdateEmployeeUseCase {
  constructor(private employeeRepository: IEmployeeRepository) {}

  async execute({
    companyId,
    id,
    name,
    CPF,
    phone,
    role,
  }: IUpdateEmployeeUseCaseRequest) {
    if (CPF) {
      const searchedClientByCPF =
        await this.employeeRepository.findByCPFAndCompanyId(CPF, companyId)
      if (searchedClientByCPF) {
        throw new CPFAlreadyExistsError()
      }
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
