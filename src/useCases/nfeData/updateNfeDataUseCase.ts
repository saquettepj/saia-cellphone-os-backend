import {
  NfeDataCodigoRegimeTributarioEnum,
  NfeDataRegimeTributarioEnum,
} from '@/enums/all.enum'
import { INfeDataRepository } from '@/repositories/nfeData/INfeDataRepository'

interface IUpdateNfeDataUseCaseRequest {
  id: string
  inscricaoEstadual?: string
  regimeTributario?: NfeDataRegimeTributarioEnum
  cnae?: string
  idCSC?: string
  CSC?: string
}

class UpdateNfeDataUseCase {
  constructor(private nfeDataRepository: INfeDataRepository) {}

  async execute({
    id,
    inscricaoEstadual,
    regimeTributario,
    cnae,
    idCSC,
    CSC,
  }: IUpdateNfeDataUseCaseRequest) {
    let result

    if (regimeTributario) {
      const codigoRegimeTributario =
        NfeDataCodigoRegimeTributarioEnum[regimeTributario]

      result = await this.nfeDataRepository.updateById(id, {
        inscricaoEstadual,
        regimeTributario,
        codigoRegimeTributario,
        cnae,
        idCSC,
        CSC,
      })
    } else {
      result = await this.nfeDataRepository.updateById(id, {
        inscricaoEstadual,
        regimeTributario,
        cnae,
        idCSC,
        CSC,
      })
    }

    return result
  }
}

export { UpdateNfeDataUseCase, IUpdateNfeDataUseCaseRequest }
