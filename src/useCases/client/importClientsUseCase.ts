import { IClientRepository } from '@/repositories/client/IClientRepository'

interface IImportClientsUseCaseRequest {
  clients: {
    name: string
    CPF: string
    email?: string | null
    phone?: string | null
  }[]
  companyId: string
}

export class ImportClientsUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute(data: IImportClientsUseCaseRequest) {
    const { companyId, clients } = data

    const CPFs = clients.map((client) => client.CPF)
    const emails = clients
      .map((client) => client.email)
      .filter((email): email is string => !!email)

    const existingByCPF = await this.clientRepository.findManyByCPF({
      companyId,
      CPFs,
    })

    const existingByEmail = await this.clientRepository.findManyByEmail({
      companyId,
      emails,
    })

    const existingCPFs = new Set(existingByCPF.map((client) => client.CPF))
    const existingEmails = new Set(
      existingByEmail.map((client) => client.email),
    )

    const newClients = clients.filter(
      (client) =>
        !existingCPFs.has(client.CPF) &&
        (!client.email || !existingEmails.has(client.email)),
    )

    const toCreate = newClients.map((client) => ({
      ...client,
      companyId,
    }))

    const createdClients = await this.clientRepository.createMany(toCreate)

    return createdClients
  }
}
