import { IServiceRepository } from '@/repositories/service/IServiceRepository'

interface IGetServicesUseCaseRequest {
  id?: string
  orderItemId?: string
  employeeId?: string
  status?: string
  report?: string
}

class GetServiceUseCase {
  constructor(private serviceRepository: IServiceRepository) {}

  async execute({
    id,
    orderItemId,
    employeeId,
    status,
    report,
  }: IGetServicesUseCaseRequest) {
    const searchedServices = await this.serviceRepository.findAllByFilters({
      id,
      orderItemId,
      employeeId,
      status,
      report,
    })

    return searchedServices.map((service) => ({
      id: service.id,
      orderItemId: service.orderItemId,
      employeeId: service.employeeId,
      employee: service.employee,
      status: service.status,
      report: service.report,
    }))
  }
}

export { GetServiceUseCase, IGetServicesUseCaseRequest }
