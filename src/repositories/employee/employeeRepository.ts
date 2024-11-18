import { Prisma } from '@prisma/client'

import { IEmployeeRepository } from '@/repositories/employee/IEmployeeRepository'
import { prisma } from '@/app'

class EmployeeRepository implements IEmployeeRepository {
  async findById(id: string) {
    return prisma.employee.findUnique({
      where: { id },
    })
  }

  async findAllByCompanyId(
    companyId: string,
    data: Partial<Prisma.EmployeeCreateManyInput>,
  ) {
    const searchedEmployees = await prisma.employee.findMany({
      where: {
        companyId,
        ...(data.id && { id: { contains: data.id } }),
        ...(data.name && { name: { contains: data.name } }),
        ...(data.CPF && { CPF: { contains: data.CPF } }),
        ...(data.role && { role: { contains: data.role } }),
      },
      include: {
        orders: { where: { employeeId: data.id } },
      },
    })

    return searchedEmployees
  }

  async findByCPF(CPF: string) {
    return prisma.employee.findFirst({
      where: { CPF },
    })
  }

  async findByCPFAndCompanyId(CPF: string, companyId: string) {
    return prisma.employee.findFirst({
      where: { CPF, companyId },
    })
  }

  async create(data: Prisma.EmployeeUncheckedCreateInput) {
    return prisma.employee.create({
      data,
    })
  }

  async updateById(id: string, data: Prisma.EmployeeUpdateInput) {
    return prisma.employee.update({
      where: { id },
      data,
    })
  }

  async delete(id: string) {
    const deletedEmployee = await prisma.employee.delete({
      where: { id },
    })

    return deletedEmployee
  }
}

export { EmployeeRepository }
