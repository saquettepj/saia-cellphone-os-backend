import { verify } from 'jsonwebtoken'

import { env } from '@/env'

interface IPayLoad {
  sub: string
}

function getCompanyIdByToken(token: string) {
  const { sub: id } = verify(token, env.SESSION_TOKEN) as IPayLoad

  return id
}

export { getCompanyIdByToken }
