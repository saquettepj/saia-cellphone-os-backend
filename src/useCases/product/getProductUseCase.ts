import { IProductRepository } from '@/repositories/product/IProductRepository'

interface IGetProductsUseCaseRequest {
  companyId: string
  id?: string
  manufactureBy?: string
  model?: string
  condition?: string
  description?: string
}

class GetProductUseCase {
  constructor(private companyRepository: IProductRepository) {}

  async execute({
    companyId,
    id,
    manufactureBy,
    model,
    condition,
    description,
  }: IGetProductsUseCaseRequest) {
    const searchedCompanies = await this.companyRepository.findAllByCompanyId(
      companyId,
      { id, manufactureBy, model, condition, description },
    )

    return searchedCompanies
  }
}

export { GetProductUseCase }
