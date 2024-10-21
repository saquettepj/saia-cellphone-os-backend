import {
  NfeDataCodigoRegimeTributarioEnum,
  NfeDataRegimeTributarioEnum,
} from '@/enums/all.enum'
import { OnlyOneEntityError } from '@/errors/onlyOneEntityError'
import { INfeDataRepository } from '@/repositories/nfeData/INfeDataRepository'

interface ICreateNfeDataUseCaseRequest {
  companyId: string
  inscricaoEstadual: string
  regimeTributario: NfeDataRegimeTributarioEnum
  cnae: string
  idCSC: string
  CSC: string
}

class CreateNfeDataUseCase {
  constructor(private nfeDataRepository: INfeDataRepository) {}

  async execute({
    companyId,
    inscricaoEstadual,
    regimeTributario,
    cnae,
    idCSC,
    CSC,
  }: ICreateNfeDataUseCaseRequest) {
    const existingNfeData = await this.nfeDataRepository.findAllByCompanyId(
      companyId,
      {},
    )

    if (existingNfeData.length > 0) {
      throw new OnlyOneEntityError()
    }

    const codigoRegimeTributario =
      NfeDataCodigoRegimeTributarioEnum[regimeTributario]

    const nfeData = await this.nfeDataRepository.create({
      companyId,
      inscricaoEstadual,
      regimeTributario,
      codigoRegimeTributario,
      cnae,
      idCSC,
      CSC,
    })

    return nfeData
  }
}

export { CreateNfeDataUseCase, ICreateNfeDataUseCaseRequest }
