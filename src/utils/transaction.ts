import { PrismaClient } from '@prisma/client'

import { prisma } from '@/app'

interface ITransactionClient {
  order: typeof prisma.order
  orderItem: typeof prisma.orderItem
  product: typeof prisma.product
  service: typeof prisma.service
}

interface ITransaction {
  run<T>(callback: (transaction: ITransactionClient) => Promise<T>): Promise<T>
}

class PrismaTransaction implements ITransaction {
  private client: PrismaClient

  constructor(client: PrismaClient = prisma) {
    this.client = client
  }

  async run<T>(
    callback: (transaction: ITransactionClient) => Promise<T>,
  ): Promise<T> {
    return await this.client.$transaction(async (prismaTransaction) => {
      const transactionClient: ITransactionClient = {
        order: prismaTransaction.order,
        orderItem: prismaTransaction.orderItem,
        product: prismaTransaction.product,
        service: prismaTransaction.service,
      }
      return callback(transactionClient)
    })
  }
}

export { ITransaction, PrismaTransaction }
