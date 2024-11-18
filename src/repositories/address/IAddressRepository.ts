import { Address, Prisma } from '@prisma/client'

interface IAddressRepository {
  findById(id: string): Promise<Address | null>
  findByClientId(clientId: string): Promise<Address | null>
  findByCompanyId(companyId: string): Promise<Address | null>
  findAllByCompanyId(
    companyId: string,
    data: Partial<Prisma.AddressCreateManyInput>,
  ): Promise<Address | null>
  updateByClientId(
    clientId: string,
    data: Prisma.AddressUpdateInput,
  ): Promise<Address>
  updateByCompanyId(
    companyId: string,
    data: Prisma.AddressUpdateInput,
  ): Promise<Address | null>
  delete(id: string): Promise<Address>
  create(data: Prisma.AddressUncheckedCreateInput): Promise<Address>
}

export { IAddressRepository }
