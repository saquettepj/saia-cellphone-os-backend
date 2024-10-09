import 'dotenv/config'
import { randomUUID } from 'crypto'
import { execSync } from 'child_process'

import type { Environment } from 'vitest'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_TEST_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable!')
  }

  const url = new URL(process.env.DATABASE_TEST_URL)

  url.searchParams.set('schema', schema)

  process.env.DATABASE_URL = url.toString()
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',

  setup() {
    const schema = randomUUID()
    generateDatabaseURL(schema)

    execSync('dotenv -e .env.test -- npx prisma migrate deploy')
    execSync('dotenv -e .env.test -- npx prisma db seed')

    console.log('🟨 Setup test environment! 🟨')

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )
        await prisma.$disconnect()
      },
    }
  },
}
