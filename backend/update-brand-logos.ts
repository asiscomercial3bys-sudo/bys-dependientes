import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const logos: Record<string, string> = {
  'AGIVA': '/img/marcas/agiva.svg',
  'ALUCINANTE': '/img/marcas/alucinante.svg',
  'BADI': '/img/marcas/badi.svg',
  'CHOCOLISS/AMARITE': '/img/marcas/chocoliss.svg',
  'GRYNTEC': '/img/marcas/gryntec.svg',
  'LECHE PAL PELO': '/img/marcas/lechepp.svg',
  'NEW TURBO SAS': '/img/marcas/newturbo.svg',
  'PROKPIL': '/img/marcas/prokpil.svg',
  'TECNOGLOBAL': '/img/marcas/tecnoglobal.svg',
};

async function main() {
  for (const [nombre, url] of Object.entries(logos)) {
    const res = await prisma.marca.updateMany({
      where: { nombre },
      data: { imagenUrl: url },
    });
    console.log(`${nombre}: ${res.count} updated`);
  }
}

main().then(() => prisma.$disconnect());
