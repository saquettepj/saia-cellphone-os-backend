import { AccountPayTypeEnum } from '@/enums/all.enum'

function returnPayType(amount: number | undefined): {
  payType: AccountPayTypeEnum
  withNfe: boolean
} {
  let payType = AccountPayTypeEnum.MONTHLY
  const withNfe = false

  switch (amount) {
    case 180:
      payType = AccountPayTypeEnum.MONTHLY
      break
    case 1025:
      payType = AccountPayTypeEnum.SEMIANNUAL
      break
    case 1940:
      payType = AccountPayTypeEnum.ANNUAL
      break
    default:
      payType = AccountPayTypeEnum.MONTHLY
  }

  return { payType, withNfe }
}

export { returnPayType }
