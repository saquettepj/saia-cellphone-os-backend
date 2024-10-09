import { ICreateCompanyUseCaseRequest } from '@/useCases/company/createCompanyUseCase'
import { ICreateProductUseCaseRequest } from '@/useCases/product/createProductUseCase'

const createNewCompanyTestObject = (
  params?: Partial<ICreateCompanyUseCaseRequest>,
) => ({
  CNPJ: params?.CNPJ || '11111111111111',
  email: params?.email || 'teste@email.com',
  name: params?.name || 'NomeTeste',
  CEP: params?.CEP || '02132132',
  password: params?.password || '27E53109fgh!',
  passwordConfirmation: params?.passwordConfirmation || '27E53109fgh!',
})

const createNewProductTestObject = (
  params?: Partial<ICreateProductUseCaseRequest>,
) => ({
  manufactureBy: params?.manufactureBy || 'marca teste',
  model: params?.model || 'modelo teste',
  condition: params?.condition || 'GOOD',
  description: params?.description || 'descricao teste',
})

export { createNewCompanyTestObject, createNewProductTestObject }
