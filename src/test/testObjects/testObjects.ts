import { v4 as uuidv4 } from 'uuid'

import { ICreateCompanyUseCaseRequest } from '@/useCases/company/createCompanyUseCase'
import { ICreateProductUseCaseRequest } from '@/useCases/product/createProductUseCase'
import { ICreateClientUseCaseRequest } from '@/useCases/client/createClientUseCase'
import { ICreateEmployeeUseCaseRequest } from '@/useCases/employee/createEmployeeUseCase'
import { ICreateAddressUseCaseRequest } from '@/useCases/address/createAddressUseCase'
import { ProductConditionEnum, ProductTypeEnum } from '@/enums/all.enum'
import { ICreateOrderUseCaseRequest } from '@/useCases/order/createOrderUseCase'
import { ICreateOrderItemUseCaseRequest } from '@/useCases/orderItem/createOrderItemUseCase'

let uniqueDescriptionCounter = 1

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
  description:
    params?.description ||
    `Descrição teste TESTE tEsTe ${uniqueDescriptionCounter++}`,
  price: params?.price || 100.0,
  quantity: params?.quantity || 1,
})

const createNewClientTestObject = (
  params?: Partial<ICreateClientUseCaseRequest>,
) => ({
  name: params?.name || 'Test Client',
  CPF: params?.CPF || '12345678901',
  email: params?.email || 'clientemail@test.com',
  phone: params?.phone || '1234567890',
})

const createNewEmployeeTestObject = (
  params?: Partial<ICreateEmployeeUseCaseRequest>,
) => ({
  name: params?.name || 'Test Employee',
  CPF: params?.CPF || '12345678901',
  phone: params?.phone || '1234567890',
  role: params?.role || 'Manager',
})

const createNewAddressTestObject = (
  params?: Partial<ICreateAddressUseCaseRequest>,
) => ({
  country: params?.country || 'Brazil',
  city: params?.city || 'CityTest',
  state: params?.state || 'StateTest',
  neighborhood: params?.neighborhood || 'NeighborhoodTest',
  street: params?.street || 'StreetTest',
  streetNumber: params?.streetNumber || '1000',
  zipCode: params?.zipCode || '12345678',
  clientId: params?.clientId || undefined,
})

const createNewOrderTestObject = (
  params?: Partial<ICreateOrderUseCaseRequest>,
) => ({
  clientId: params?.clientId || uuidv4(),
  employeeId: params?.employeeId || uuidv4(),
  type: params?.type || 'sale',
  status: params?.status || 'pending',
  payDate: params?.payDate || new Date().toISOString(),
  paymentMethod: params?.paymentMethod || 'credit',
  price: params?.price || 100.0,
  description: params?.description || 'Order description',
  orderItems: params?.orderItems || [
    { productId: params?.orderItems?.[0]?.productId || uuidv4(), quantity: 1 },
  ],
})

const updateNewOrderTestObject = (
  params?: Partial<ICreateOrderUseCaseRequest>,
) => ({
  companyId: params?.companyId || uuidv4(),
  clientId: params?.clientId || uuidv4(),
  employeeId: params?.employeeId || uuidv4(),
  type: params?.type || 'sale',
  status: params?.status || 'pending',
  payDate: params?.payDate || new Date().toISOString(),
  paymentMethod: params?.paymentMethod || 'credit',
  price: params?.price || 100.0,
  description: params?.description || 'Order description',
})

const createNewOrderItemTestObject = (
  params?: Partial<ICreateOrderItemUseCaseRequest>,
) => ({
  orderId: params?.orderId || uuidv4(),
  productId: params?.productId || uuidv4(),
  quantity: params?.quantity || 1,
})

const createNewAccessTokenTestObject = (params?: { companyId?: string }) => ({
  companyId: params?.companyId || undefined,
})

export {
  createNewCompanyTestObject,
  createNewProductTestObject,
  createNewClientTestObject,
  createNewEmployeeTestObject,
  createNewAddressTestObject,
  createNewOrderTestObject,
  updateNewOrderTestObject,
  createNewOrderItemTestObject,
  createNewAccessTokenTestObject,
}
