import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

const databaseUrl = env('DATABASE_URL')
console.log('DATABASE_URL:', databaseUrl ? '✓ Carregada' : '✗ Não encontrada')
console.log(
  'Valor (mascarado):',
  databaseUrl ? databaseUrl.replace(/:[^:@]+@/, ':****@') : 'undefined',
)

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: databaseUrl,
  },
})

