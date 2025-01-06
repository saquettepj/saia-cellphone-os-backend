import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('production'),
  DATABASE_URL: z.string(),
  FRONTEND_URL: z.string(),
  PORT: z.coerce.number().default(3333),
  SESSION_TOKEN: z.string(),
  RESET_PASSWORD_TOKEN: z.string(),
  AUTOMATIC_EMAIL_USER: z.string().email(),
  AUTOMATIC_EMAIL_PASS: z.string(),
  SUPPORT_EMAIL_USER: z.string().email(),
  AWS_BUCKET_NAME: z.string(),
  AWS_BUCKET_REGION: z.string(),
  AWS_BUCKET_ACCESS_USER_KEY: z.string(),
  AWS_BUCKET_ACCESS_USER_PASS: z.string(),
  ADMIN_ACCOUNT_CNPJ: z.string().optional(),
  ADMIN_ACCOUNT_PASSWORD: z.string().optional(),
  ADMIN_DELETE_PASSWORD: z.string(),
  ADMIN_UPDATE_PASSWORD: z.string(),
  SYSTEM_ID: z.string().uuid(),
  MERCADO_PAGO_KEY: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  _env.error.format()
  console.log('❌ Invalid environment variables! ❌', _env?.error?.issues)
  throw new Error('Invalid environment variables!')
}

export const env = _env.data
