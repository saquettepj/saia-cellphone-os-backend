import { CreatePaymentUseCase } from '../createPaymentUseCase'

function setupCreatePaymentUseCase() {
  return new CreatePaymentUseCase()
}

export { setupCreatePaymentUseCase }
