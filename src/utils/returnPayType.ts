import { AccountPayTypeEnum } from '@/enums/all.enum'

function returnPayType(amount: number | undefined): {
  payType: AccountPayTypeEnum
  withNfe: boolean
} {
  let payType = AccountPayTypeEnum.MONTHLY
  let withNfe = false

  switch (amount) {
    case 1:
      payType = AccountPayTypeEnum.MONTHLY
      break
    case 2:
      payType = AccountPayTypeEnum.SEMIANNUAL
      break
    case 3:
      payType = AccountPayTypeEnum.ANNUAL
      break
    case 4:
      payType = AccountPayTypeEnum.MONTHLY
      withNfe = true
      break
    case 5:
      payType = AccountPayTypeEnum.SEMIANNUAL
      withNfe = true
      break
    case 6:
      payType = AccountPayTypeEnum.ANNUAL
      withNfe = true
      break
    default:
      payType = AccountPayTypeEnum.MONTHLY
  }

  return { payType, withNfe }
}

export { returnPayType }
