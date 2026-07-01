import { PrismaClient } from '@prisma/client';
import { writeFileSync } from 'fs';

const prisma = new PrismaClient();

async function main() {
  const marcas = await prisma.marca.findMany();
  const productos = await prisma.producto.findMany();
  const niveles = await prisma.nivelPremio.findMany();
  const config = await prisma.config.findMany();
  const tiendas = await prisma.tienda.findMany();

  writeFileSync('export.json', JSON.stringify({ marcas, productos, niveles, config, tiendas }, null, 2));
  console.log(`Exported: ${marcas.length} marcas, ${productos.length} productos, ${niveles.length} niveles, ${config.length} config, ${tiendas.length} tiendas`);
}

main().then(() => prisma.$disconnect());
