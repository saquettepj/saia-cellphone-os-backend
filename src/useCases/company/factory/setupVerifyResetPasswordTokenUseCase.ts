import { VerifyResetPasswordTokenUseCase } from '../verifyResetPasswordTokenUseCase'

export function setupVerifyResetPasswordTokenUseCase() {
  return new VerifyResetPasswordTokenUseCase()
}
