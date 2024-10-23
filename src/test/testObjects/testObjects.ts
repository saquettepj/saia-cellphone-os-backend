import { ICreateCompanyUseCaseRequest } from '@/useCases/company/createCompanyUseCase'
import { ICreateProductUseCaseRequest } from '@/useCases/product/createProductUseCase'
import { ProductConditionEnum, ProductTypeEnum } from '@/enums/all.enum'

const createNewCompanyTestObject = (
  params?: Partial<ICreateCompanyUseCaseRequest>,
) => ({
  CNPJ: params?.CNPJ || '11111111111111',
  email: params?.email || 'teste@email.com',
  name: params?.name || 'NomeTeste',
  password: params?.password || '27E53109fgh!',
  passwordConfirmation:
    params?.passwordConfirmation || params?.password || '27E53109fgh!',
})

const createNewProductTestObject = (
  params?: Partial<ICreateProductUseCaseRequest>,
) => ({
  type: params?.type || ProductTypeEnum.PRODUCT,
  condition: params?.condition || ProductConditionEnum.NEW,
  description: params?.description || 'descricao teste',
  price: params?.price || 100.0,
  quantity: params?.quantity || 1,
})

export { createNewCompanyTestObject, createNewProductTestObject }
