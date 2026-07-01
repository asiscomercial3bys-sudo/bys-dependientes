import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.nivelPremio.createMany({
    data: [
      { nombre: 'Bronce', puntosMinimos: 100, descripcionPremio: 'PENDIENTE: definir premio nivel Bronce' },
      { nombre: 'Plata', puntosMinimos: 500, descripcionPremio: 'PENDIENTE: definir premio nivel Plata' },
      { nombre: 'Oro', puntosMinimos: 1500, descripcionPremio: 'PENDIENTE: definir premio nivel Oro' },
    ],
    skipDuplicates: true,
  });

  await prisma.config.createMany({
    data: [
      { clave: 'texto_premios', valor: 'Acumula puntos con cada venta que registres y alcanza niveles para obtener premios exclusivos.' },
    ],
    skipDuplicates: true,
  });

  console.log('Seed completado.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
