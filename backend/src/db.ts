import { PrismaClient } from '@prisma/client';

// En producción DATABASE_URL puede apuntar al pooler, mientras que DIRECT_URL
// es la conexión directa usada por las operaciones de esquema. Priorizar la
// conexión directa evita que las consultas de la aplicación fallen cuando el
// pooler cambia o deja de reconocer el tenant configurado.
const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL o DIRECT_URL debe estar configurada');
}

const prisma = new PrismaClient({
  datasources: {
    db: { url: databaseUrl },
  },
});

export default prisma;
