import { AccountPayTypeEnum } from '@/enums/all.enum'

function returnPayType(amount: number | undefined): AccountPayTypeEnum {
  if (amount === 3) {
    return AccountPayTypeEnum.ANNUAL
  } else if (amount === 2) {
    return AccountPayTypeEnum.SEMIANNUAL
  } else return AccountPayTypeEnum.MONTHLY
}

export { returnPayType }
