import { INfeDataRepository } from '@/repositories/nfeData/INfeDataRepository'

interface IGetNfeDataUseCaseRequest {
  companyId: string
  id?: string
  inscricaoEstadual?: string
  regimeTributario?: string
  codigoRegimeTributario?: string
  cnae?: string
  idCSC?: string
  CSC?: string
}

class GetNfeDataUseCase {
  constructor(private nfeDataRepository: INfeDataRepository) {}

  async execute({
    companyId,
    id,
    inscricaoEstadual,
    regimeTributario,
    codigoRegimeTributario,
    cnae,
    idCSC,
    CSC,
  }: IGetNfeDataUseCaseRequest) {
    const searchedNfeData = await this.nfeDataRepository.findAllByCompanyId(
      companyId,
      {
        id,
        inscricaoEstadual,
        regimeTributario,
        codigoRegimeTributario,
        cnae,
        idCSC,
        CSC,
      },
    )

    return searchedNfeData
  }
}

export { GetNfeDataUseCase }
