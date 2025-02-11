import { hash } from 'argon2'

import { prisma } from '@/app'
import { env } from '@/env'

async function main() {
  if (
    env.ADMIN_ACCOUNT_CNPJ &&
    env.ADMIN_ACCOUNT_PASSWORD &&
    env.ADMIN_EMAIL_USER
  ) {
    const passwordHash = await hash(env.ADMIN_ACCOUNT_PASSWORD.trim())

    const company = await prisma.company.create({
      data: {
        CNPJ: env.ADMIN_ACCOUNT_CNPJ,
        email: env.ADMIN_EMAIL_USER,
        accountType: 'ADMIN',
        emailConfirmationCode: 647384,
        emailChecked: true,
        name: 'Conta de Administrador',
        passwordHash,
      },
    })

    console.log('Admin created: ', { CNPJ: company.CNPJ })
  }

  const systemConfig = await prisma.systemConfig.create({
    data: {
      id: env.SYSTEM_ID,
      terms: '',
      subscriptionAgreement: '',
    },
  })

  if (systemConfig) {
    console.log('Terms created.')
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
