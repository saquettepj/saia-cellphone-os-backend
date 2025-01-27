import crypto from 'crypto'

import { env } from '@/env'

function getValidatedKey(): Buffer {
  const secretKeyHex = env.ENCRYPT_KEY || ''
  const secretKey = Buffer.from(secretKeyHex, 'hex')

  return secretKey
}

export function encryptPassword(password: string): string {
  const secretKey = getValidatedKey()
  const iv = crypto.randomBytes(16)

  const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv)
  let encrypted = cipher.update(password, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  return `${iv.toString('hex')}:${encrypted}`
}

export function decryptPassword(encryptedPassword: string): string {
  const secretKey = getValidatedKey()
  const [ivHex, encrypted] = encryptedPassword.split(':')
  const iv = Buffer.from(ivHex, 'hex')

  const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, iv)
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}
