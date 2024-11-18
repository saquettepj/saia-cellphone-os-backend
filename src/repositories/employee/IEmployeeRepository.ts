import { Employee, Order, Prisma } from '@prisma/client'

interface IEmployee extends Employee {
  orders?: Order[] | null
}

interface IEmployeeRepository {
  findById(id: string): Promise<IEmployee | null>
  findByCPF(CPF: string): Promise<IEmployee | null>
  findByCPFAndCompanyId(
    CPF: string,
    companyId: string,
  ): Promise<IEmployee | null>
  findAllByCompanyId(
    companyId: string,
    data: Partial<Prisma.EmployeeCreateManyInput>,
  ): Promise<IEmployee[]>
  create(data: Prisma.EmployeeUncheckedCreateInput): Promise<IEmployee>
  updateById(id: string, data: Prisma.EmployeeUpdateInput): Promise<IEmployee>
  delete(id: string): Promise<IEmployee | null>
}

export { IEmployeeRepository, IEmployee }
