import { PrismaClient } from '@prisma/client';

const p = new PrismaClient();

async function main() {
  await p.tienda.upsert({
    where: { nit: '900123456' },
    update: {},
    create: { nit: '900123456', nombre: 'Tienda Demo' },
  });

  const marcasData = [
    { nombre: 'LOréal', orden: 1 },
    { nombre: 'Revlon', orden: 2 },
    { nombre: 'Maybelline', orden: 3 },
    { nombre: 'MAC', orden: 4 },
  ];
  for (const m of marcasData) {
    await p.marca.create({ data: m }).catch(() => {});
  }

  const marcas = await p.marca.findMany();
  const byName = (n: string) => marcas.find((m) => m.nombre === n)!;

  const productos = [
    { nombre: 'Base Matte 24h', marcaId: byName('LOréal').id, puntosPorVenta: 15, modoDeUso: 'Aplicar con esponja húmeda sobre rostro limpio. Difuminar desde el centro hacia afuera.' },
    { nombre: 'Labial Ultra HD', marcaId: byName('Revlon').id, puntosPorVenta: 10, modoDeUso: 'Aplicar directamente sobre los labios. Puede usarse como base o color intenso.' },
    { nombre: 'Máscara Lash Sensational', marcaId: byName('Maybelline').id, puntosPorVenta: 12, modoDeUso: 'Aplicar desde la raíz de las pestañas hacia las puntas con movimientos en zigzag.' },
    { nombre: 'Polvo Studio Fix', marcaId: byName('MAC').id, puntosPorVenta: 20, modoDeUso: 'Aplicar con brocha sobre base o piel limpia para un acabado mate.' },
    { nombre: 'Corrector Infallible', marcaId: byName('LOréal').id, puntosPorVenta: 8, modoDeUso: 'Aplicar bajo los ojos en triángulo invertido. Difuminar con esponja.' },
  ];
  for (const prod of productos) {
    await p.producto.create({ data: prod }).catch(() => {});
  }

  console.log('Datos demo insertados correctamente');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => p.$disconnect());
