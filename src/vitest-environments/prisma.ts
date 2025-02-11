import 'dotenv/config'
import { randomUUID } from 'crypto'
import { execSync } from 'child_process'

import type { Environment } from 'vitest/environments'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function generateDatabaseURL() {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('Wrong environment variables!')
  }

  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable!')
  }

  const url = new URL(process.env.DATABASE_URL)

  const schema = `schema_${randomUUID().replace(/-/g, '')}`

  url.searchParams.set('schema', schema)

  process.env.DATABASE_URL = url.toString()

  return schema
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',

  setup() {
    const schema = generateDatabaseURL()

    execSync('pnpx prisma migrate deploy')
    execSync('pnpx prisma db seed')

    console.log('🟨 Setup test environment! 🟨')

    return {
      async teardown() {
        try {
          await prisma.$executeRawUnsafe(
            `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
          )
        } catch (error) {
          console.error(`Error during teardown: ${error}`)
        } finally {
          await prisma.$disconnect()
        }
      },
    }
  },
}
