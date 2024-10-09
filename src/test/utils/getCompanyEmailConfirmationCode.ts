import { prisma } from '@/app'

async function getCompanyEmailConfirmationCode(companyId: string) {
  const searchedCompany = await prisma.company.findFirst({
    where: { id: companyId },
  })

  return searchedCompany?.emailConfirmationCode
}

export { getCompanyEmailConfirmationCode }
