import { v4 as uuidv4 } from 'uuid'

import { ICreateCompanyUseCaseRequest } from '@/useCases/company/createCompanyUseCase'
import { ICreateProductUseCaseRequest } from '@/useCases/product/createProductUseCase'
import { ICreateClientUseCaseRequest } from '@/useCases/client/createClientUseCase'
import { ICreateEmployeeUseCaseRequest } from '@/useCases/employee/createEmployeeUseCase'
import { ICreateAddressUseCaseRequest } from '@/useCases/address/createAddressUseCase'
import {
  OrderStatusEnum,
  OrderTypeEnum,
  PaymentMethodEnum,
  PaymentStatusEnum,
  ProductConditionEnum,
  ProductTypeEnum,
  RoleEnum,
} from '@/enums/all.enum'
import { ICreateOrderUseCaseRequest } from '@/useCases/order/createOrderUseCase'
import { ICreateOrderItemUseCaseRequest } from '@/useCases/orderItem/createOrderItemUseCase'
import { ICreateSupplierUseCaseRequest } from '@/useCases/supplier/createSupplierUseCase'
import { ICreateServiceUseCaseRequest } from '@/useCases/service/createServiceUseCase'
import { IUpdateOrderItemUseCaseRequest } from '@/useCases/orderItem/updateOrderItemUseCase'

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
  cost: params?.cost || 50.0,
  quantity: params?.quantity || 1,
  localization: params?.localization || 'Localização padrão',
  supplierId: params?.supplierId || undefined,
})

const createNewClientTestObject = (
  params?: Partial<ICreateClientUseCaseRequest>,
) => ({
  name: params?.name || 'Test Client',
  CPF: params?.CPF || '12345678901',
  email: params?.email || 'clientemail@test.com',
  phone: params?.phone || '1234567890',
})

const createNewSupplierTestObject = (
  params?: Partial<ICreateSupplierUseCaseRequest>,
) => ({
  name: params?.name || 'Test Supplier',
  CNPJ: params?.CNPJ || '12345678000123',
  CEP: params?.CEP || '12345678',
  email: params?.email || 'supplieremail@test.com',
  phone: params?.phone || '1234567890',
})

const createNewEmployeeTestObject = (
  params?: Partial<ICreateEmployeeUseCaseRequest>,
) => ({
  name: params?.name || 'Test Employee',
  CPF: params?.CPF || '12005678901',
  phone: params?.phone || '1234567890',
  role: params?.role || RoleEnum.ATTENDANT,
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
  IMEI: params?.IMEI || '123456789012345',
  clientId: params?.clientId || uuidv4(),
  employeeId: params?.employeeId || uuidv4(),
  type: params?.type || OrderTypeEnum.SALE,
  status: params?.status || OrderStatusEnum.PENDING,
  payDate: params?.payDate || new Date().toISOString(),
  paymentMethod: params?.paymentMethod || PaymentMethodEnum.CREDIT_CARD,
  paymentStatus: params?.paymentStatus || PaymentStatusEnum.OPEN,
  firstDueDate: params?.firstDueDate || undefined,
  dueDate: params?.dueDate || undefined,
  numberOfInstallments: params?.numberOfInstallments || undefined,
  interest: params?.interest || undefined,
  amountPaid: params?.amountPaid || undefined,
  description: params?.description || 'Order description',
  orderItems: params?.orderItems || [
    {
      productId: params?.orderItems?.[0]?.productId || uuidv4(),
      quantity: params?.orderItems?.[0]?.quantity || 1,
      discount: params?.orderItems?.[0]?.discount || 0,
      service: params?.orderItems?.[0]?.service || {
        employeeId: params?.orderItems?.[0]?.service?.employeeId || null,
      },
    },
  ],
})

const updateNewOrderTestObject = (
  params?: Partial<ICreateOrderUseCaseRequest>,
) => ({
  IMEI: params?.IMEI || '123456789012345',
  clientId: params?.clientId || uuidv4(),
  employeeId: params?.employeeId || uuidv4(),
  type: params?.type || OrderTypeEnum.SALE,
  status: params?.status || OrderStatusEnum.CANCELED,
  payDate: params?.payDate || new Date().toISOString(),
  paymentMethod: params?.paymentMethod || PaymentMethodEnum.DEBIT_CARD,
  paymentStatus: params?.paymentStatus || PaymentStatusEnum.INVOICED,
  firstDueDate: params?.firstDueDate || undefined,
  dueDate: params?.dueDate || undefined,
  numberOfInstallments: params?.numberOfInstallments || undefined,
  interest: params?.interest || undefined,
  amountPaid: params?.amountPaid || undefined,
  description: params?.description || undefined,
})

const createNewOrderItemTestObject = (
  params?: Partial<ICreateOrderItemUseCaseRequest>,
) => ({
  orderId: params?.orderId || uuidv4(),
  productId: params?.productId || uuidv4(),
  discount: params?.discount || undefined,
  quantity: params?.quantity || 1,
})

const updateNewOrderItemTestObject = (
  params?: Partial<IUpdateOrderItemUseCaseRequest>,
) => ({
  discount: params?.discount || undefined,
  quantity: params?.quantity || 1,
})

const createNewServiceTestObject = (
  params?: Partial<ICreateServiceUseCaseRequest>,
) => ({
  orderItemId: params?.orderItemId || uuidv4(),
  employeeId: params?.employeeId || uuidv4(),
  status: params?.status || undefined,
  report: params?.status || undefined,
})

const createNewAccessTokenTestObject = (params?: { companyId?: string }) => ({
  companyId: params?.companyId || undefined,
})

export {
  createNewCompanyTestObject,
  createNewProductTestObject,
  createNewClientTestObject,
  createNewSupplierTestObject,
  createNewEmployeeTestObject,
  createNewAddressTestObject,
  createNewOrderTestObject,
  updateNewOrderTestObject,
  createNewOrderItemTestObject,
  updateNewOrderItemTestObject,
  createNewServiceTestObject,
  createNewAccessTokenTestObject,
}
