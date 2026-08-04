import { PrismaClient } from '@prisma/client';
import data from './products-data.json';

const prisma = new PrismaClient();

async function main() {
  // Delete old demo products and brands
  await prisma.venta.deleteMany({});
  await prisma.producto.deleteMany({});
  await prisma.marca.deleteMany({});

  // Create real brands
  const brandMap: Record<string, string> = {};
  for (let i = 0; i < data.brands.length; i++) {
    const brand = await prisma.marca.create({
      data: { nombre: data.brands[i], orden: i + 1 },
    });
    brandMap[data.brands[i]] = brand.id;
  }
  console.log(`Creadas ${data.brands.length} marcas`);

  // Create products
  let created = 0;
  for (const p of data.products) {
    const marcaId = brandMap[p.marca];
    if (!marcaId) {
      console.log(`Marca no encontrada para ${p.nombre}: ${p.marca}`);
      continue;
    }
    await prisma.producto.create({
      data: {
        codigo: p.codigo,
        nombre: p.nombre,
        marcaId,
        codigoBarras: p.codigoBarras || null,
        puntosPorVenta: 10,
      },
    });
    created++;
  }
  console.log(`Creados ${created} productos`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
