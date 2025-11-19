import 'dotenv/config'
import type { PrismaConfig } from "prisma";
import { env } from "prisma/config";

const databaseUrl = env("DATABASE_URL");
console.log("DATABASE_URL:", databaseUrl ? "✓ Carregada" : "✗ Não encontrada");
console.log("Valor (mascarado):", databaseUrl ? databaseUrl.replace(/:[^:@]+@/, ":****@") : "undefined");

export default {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: databaseUrl,
  },
} satisfies PrismaConfig;

