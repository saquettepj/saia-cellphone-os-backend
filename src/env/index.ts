import { config } from 'dotenv'
import { z } from 'zod'

if (!process.env.NODE_ENV) {
  config({ path: '.env.dev' })
} else {
  config()
}

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'prod']).default('dev'),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  DATABASE_URL: z.string()
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  _env.error.format()
  console.log('❌ Invalid environment variables! ❌', _env?.error?.issues)
  throw new Error('Invalid environment variables!')
}

export const env = _env.data
