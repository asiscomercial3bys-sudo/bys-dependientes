import prisma from './src/db';

const updates: { pattern: string; modoDeUso: string }[] = [
  // === TRATAMIENTOS MANTENIMIENTO DE COLOR ===
  // Ritual general + tiempo específico por tono
  {
    pattern: 'MANTENIMIENTO COLOR CENIZO',
    modoDeUso: 'Lavar el cabello con Shampoo Cenizo (rubios) o Shampoo Color Care (demás tonos). Enjuagar y eliminar exceso de agua con una toalla. Aplicar Tratamiento Mantenimiento de Color por mechones. Tiempo de exposición: 2 a 5 minutos. Enjuagar con abundante agua. Repetir cada tercer lavado.',
  },
  {
    pattern: 'MANTENIMIENTO COLOR PLATINO',
    modoDeUso: 'Lavar el cabello con Shampoo Cenizo (rubios) o Shampoo Color Care (demás tonos). Enjuagar y eliminar exceso de agua con una toalla. Aplicar Tratamiento Mantenimiento de Color por mechones. Tiempo de exposición: 5 a 10 minutos. Enjuagar con abundante agua. Repetir cada tercer lavado.',
  },
  {
    pattern: 'MANTENIMIENTO COLOR BEIGE',
    modoDeUso: 'Lavar el cabello con Shampoo Cenizo (rubios) o Shampoo Color Care (demás tonos). Enjuagar y eliminar exceso de agua con una toalla. Aplicar Tratamiento Mantenimiento de Color por mechones. Tiempo de exposición: 5 a 10 minutos. Enjuagar con abundante agua. Repetir cada tercer lavado.',
  },
  {
    pattern: 'MANTENIMIENTO COLOR COBRE DORADO',
    modoDeUso: 'Lavar el cabello con Shampoo Cenizo (rubios) o Shampoo Color Care (demás tonos). Enjuagar y eliminar exceso de agua con una toalla. Aplicar Tratamiento Mantenimiento de Color por mechones. Tiempo de exposición: 15 a 20 minutos. Enjuagar con abundante agua. Repetir cada tercer lavado.',
  },
  {
    pattern: 'MANTENIMIENTO COLOR COBRE ',
    modoDeUso: 'Lavar el cabello con Shampoo Cenizo (rubios) o Shampoo Color Care (demás tonos). Enjuagar y eliminar exceso de agua con una toalla. Aplicar Tratamiento Mantenimiento de Color por mechones. Tiempo de exposición: 10 a 15 minutos. Enjuagar con abundante agua. Repetir cada tercer lavado.',
  },
  {
    pattern: 'MANTENIMIENTO COLOR MALVA',
    modoDeUso: 'Lavar el cabello con Shampoo Cenizo (rubios) o Shampoo Color Care (demás tonos). Enjuagar y eliminar exceso de agua con una toalla. Aplicar Tratamiento Mantenimiento de Color por mechones. Tiempo de exposición: 10 a 15 minutos. Enjuagar con abundante agua. Repetir cada tercer lavado.',
  },
  {
    pattern: 'MANTENIMIENTO COLOR ROJO',
    modoDeUso: 'Lavar el cabello con Shampoo Cenizo (rubios) o Shampoo Color Care (demás tonos). Enjuagar y eliminar exceso de agua con una toalla. Aplicar Tratamiento Mantenimiento de Color por mechones. Tiempo de exposición: 10 a 15 minutos. Enjuagar con abundante agua. Repetir cada tercer lavado.',
  },
  {
    pattern: 'MANTENIMIENTO COLOR CHOCOLATE',
    modoDeUso: 'Lavar el cabello con Shampoo Cenizo (rubios) o Shampoo Color Care (demás tonos). Enjuagar y eliminar exceso de agua con una toalla. Aplicar Tratamiento Mantenimiento de Color por mechones. Tiempo de exposición: 10 a 15 minutos. Enjuagar con abundante agua. Repetir cada tercer lavado.',
  },
  {
    pattern: 'MANTENIMIENTO COLOR NEGRO',
    modoDeUso: 'Lavar el cabello con Shampoo Cenizo (rubios) o Shampoo Color Care (demás tonos). Enjuagar y eliminar exceso de agua con una toalla. Aplicar Tratamiento Mantenimiento de Color por mechones. Tiempo de exposición: 10 a 15 minutos. Enjuagar con abundante agua. Repetir cada tercer lavado.',
  },
  {
    pattern: 'MANTENIMIENTO COLOR AVELLANA',
    modoDeUso: 'Lavar el cabello con Shampoo Cenizo (rubios) o Shampoo Color Care (demás tonos). Enjuagar y eliminar exceso de agua con una toalla. Aplicar Tratamiento Mantenimiento de Color por mechones. Tiempo de exposición: 5 a 10 minutos. Enjuagar con abundante agua. Repetir cada tercer lavado.',
  },
  {
    pattern: 'MANTENIMIENTO COLOR MOKACHINO',
    modoDeUso: 'Lavar el cabello con Shampoo Cenizo (rubios) o Shampoo Color Care (demás tonos). Enjuagar y eliminar exceso de agua con una toalla. Aplicar Tratamiento Mantenimiento de Color por mechones. Tiempo de exposición: 15 a 20 minutos. Enjuagar con abundante agua. Repetir cada tercer lavado.',
  },
  {
    pattern: 'MANTENIMIENTO COLOR VIOLETA ROJIZO',
    modoDeUso: 'Lavar el cabello con Shampoo Cenizo (rubios) o Shampoo Color Care (demás tonos). Enjuagar y eliminar exceso de agua con una toalla. Aplicar Tratamiento Mantenimiento de Color por mechones. Tiempo de exposición: 10 a 15 minutos. Enjuagar con abundante agua. Repetir cada tercer lavado.',
  },
  {
    pattern: 'MANTENIMIENTO COLOR HUMO',
    modoDeUso: 'Lavar el cabello con Shampoo Cenizo (rubios) o Shampoo Color Care (demás tonos). Enjuagar y eliminar exceso de agua con una toalla. Aplicar Tratamiento Mantenimiento de Color por mechones. Tiempo de exposición: 2 a 5 minutos. Enjuagar con abundante agua. Repetir cada tercer lavado.',
  },

  // === SHAMPOO CENIZO ===
  {
    pattern: 'MANTENIMIENTO COLOR SHAMPOO CENIZO',
    modoDeUso: 'Humedecer el cabello con abundante agua, aplicar Shampoo Cenizo en la yema de los dedos, masajear sobre el cuero cabelludo en forma circular realizando movimientos suaves durante aproximadamente 2 minutos y emulsionar de medios a puntas y por último retirar con abundante agua.',
  },

  // === SHAMPOO COLOR CARE ===
  {
    pattern: 'COLOR CARE SHAMPOO',
    modoDeUso: 'Humedecer el cabello con abundante agua, aplicar Shampoo Color Care en la yema de los dedos, masajear sobre el cuero cabelludo en forma circular realizando movimientos suaves durante aproximadamente 2 minutos y emulsionar de medios a puntas y por último retirar con abundante agua.',
  },

  // === MASCARILLA COLOR CARE ESCUDO CROMÁTICO ===
  {
    pattern: 'COLOR CARE MASCARILLA ESCUDO CROMATICO',
    modoDeUso: 'Para proteger y prolongar el color de tu cabello, al mismo tiempo de nutrirlo e hidratarlo, lávalo con Shampoo Color Care, manteniendo tu ritual de limpieza acostumbrado. Posteriormente, aplica la Mascarilla Color Care Escudo Cromático sobre el cabello húmedo, dejándola actuar entre 5 y 10 minutos. Enjuaga hasta retirar por completo el producto.',
  },

  // === MASCARILLA CORRECTORA BLANCO POLAR ===
  {
    pattern: 'MASCARILLA CORRECTORA BLANCO POLAR',
    modoDeUso: 'Lavar el cabello con shampoo, enjuagar y aplicar distribuyendo uniformemente la Mascarilla Correctora Anti-amarillo Blanco Polar sobre el cabello húmedo, entre 10 y 20 minutos, de acuerdo a su altura de decoloración y luminosidad deseada. Enjuagar con abundante agua.',
  },

  // === ACTIVAR (viales) ===
  {
    pattern: 'ACTIVAR',
    modoDeUso: 'Tonos Fantasía: Decolorar el cabello hasta altura 9 o 10. Verter el contenido del tono Activar en un recipiente. Aplicar en cabello decolorado, limpio y semi húmedo mechón a mechón, dejar actuar 15 minutos y enjuagar con abundante agua. Intensificador de Color: Mezclar 1 sobre de Tratamiento Mantenimiento de Color Prokpil y medio vial de Activar. Aplicar sobre cabello tinturado, lavado y semi húmedo, dejar actuar 15 minutos y enjuagar.',
  },

  // === REPAIR THERAPY ===
  {
    pattern: 'REPAIR THERAPY SHAMPOO HIDRO REPARADOR',
    modoDeUso: 'Aplicar Shampoo Hidro Reparador Repair Therapy sobre el cabello mojado, distribuir homogéneamente masajeando el cuero cabelludo y el cabello, dejar actuar de 2 a 3 minutos y enjuagar adecuadamente. De ser necesario repetir el proceso.',
  },
  {
    pattern: 'REPAIR THERAPY TRATAMIENTO INTENSIVO',
    modoDeUso: 'Después de lavar tu cabello con Shampoo Hidroreparador Repair Therapy, aplicar una cantidad moderada de Tratamiento Intensivo Repair Therapy sobre la palma de tu mano de acuerdo a la cantidad de cabello y luego distribuir uniformemente sobre la fibra capilar humedecida. Dejar actuar de 5 a 10 minutos y enjuagar adecuadamente.',
  },
  {
    pattern: 'REPAIR THERAPY OLEO CAPILAR BRILLO MISTICO',
    modoDeUso: 'Después de usar el ritual completo Repair Therapy y con el cabello totalmente seco, aplicar 2 push de Óleo Repair Therapy sobre la palma de la mano, frotar y llevar al cabello de medios a puntas.',
  },
  {
    pattern: 'REPAIR THERAPY MASCARILLA BOND-PLEX',
    modoDeUso: 'Lavar tu cabello con Shampoo Repair Therapy, manteniendo tu ritual de limpieza acostumbrado. Posteriormente, aplicar la Mascarilla Bond-Plex Repair Therapy sobre el cabello húmedo (no mojado), dejándola actuar, de acuerdo al nivel de daño, entre 5 y 10 minutos. Enjuagar hasta retirar por completo el producto.',
  },

  // === MILKERATIN ===
  {
    pattern: 'MILKERATIN SHAMPOO',
    modoDeUso: 'Humedecer el cabello con abundante agua, aplicar Shampoo Milkeratin en la yema de los dedos, masajear sobre el cuero cabelludo en forma circular realizando movimientos suaves durante aproximadamente 2 minutos, distribuir de medios a puntas y masajear 20 segundos más y por último retirar con abundante agua.',
  },
  {
    pattern: 'MILKERATIN RINSE',
    modoDeUso: 'Después de lavar el cabello con Shampoo Milkeratin de Prokpil, aplicar una cantidad moderada de Rinse Milkeratin en la palma de la mano y distribuir en el cabello de medios a puntas, dejar reposar de 2 a 5 minutos y retirar con abundante agua.',
  },
  {
    pattern: 'MILKERATIN MASCARILLA REALINEACION',
    modoDeUso: 'Después de lavar con Shampoo Postlaciado Milkeratin, con el cabello húmedo, aplicar la Mascarilla Postlaciado Milkeratin. Dejarla actuar entre 10 y 15 minutos y proceder a secar y planchar entre 200°C y 230°C. Enjuagar hasta retirar la totalidad del producto. Lavar nuevamente con Shampoo Postlaciado Milkeratin, enjuagar y aplicar Rinse Postlaciado Milkeratin. Finalizar aplicando Tratamiento Lacio Seductor como protector térmico.',
  },

  // === LACIO TERMOPROTECTOR ===
  {
    pattern: 'LACIO SEDUCTOR TERMOPROTECTOR',
    modoDeUso: 'Aplicar una pequeña cantidad de Termo Protector Lacio en la palma de la mano y frotar durante 20 segundos hasta activarlo, distribuir sobre el cabello limpio y húmedo, de medios a puntas y dejar aplicado. A continuación, se puede proceder a cepillar o dejar secar al natural.',
  },

  // === CRESPOS ===
  {
    pattern: 'CRESPOS SHAMPOO HUMECTANTE',
    modoDeUso: 'Distribuir el Shampoo Crespos en el cuero cabelludo haciendo movimientos suaves y llevándolo hacia puntas, enjuagar adecuadamente. Repetir si es necesario. La frecuencia de lavado depende de los hábitos propios y personales del consumidor.',
  },
  {
    pattern: 'CRESPOS CREMA DE PEINAR',
    modoDeUso: 'Después de enjuagar el tratamiento Crespos, sobre el cabello húmedo aplicar Crema de Peinar mechón a mechón en cantidad moderada, desenredar y darle forma con las manos, dejar aplicado. Usar solo los días de lavado.',
  },
  {
    pattern: 'CRESPOS GEL LIQUIDO DEFINIDOR',
    modoDeUso: 'Después de aplicar Crema para Peinar Crespos sobre el cabello húmedo, aplicar una cantidad moderada en la palma de la mano de acuerdo a la cantidad de cabello y distribuir homogéneamente llevándolo hacia puntas peinando con los dedos.',
  },
  {
    pattern: 'CRESPOS LOCION HIDRATANTE ANTIFRIZZ',
    modoDeUso: 'Aplicar la Loción Hidratante Anti Frizz Crespos a 10 centímetros de distancia del cabello, moldear con las manos y listo, el cabello estará libre de frizz y con el volumen deseado. Usar hasta 3 veces al día.',
  },
  {
    pattern: 'CRESPOS TRATAMIENTO',
    modoDeUso: 'Después de lavar con Shampoo Crespos, aplicar una cantidad moderada sobre el cabello húmedo de medios a puntas, dejar actuar de 5 a 10 minutos y enjuagar adecuadamente.',
  },

  // === GEL FLUIDO MOLDEADOR (RIZOS) ===
  {
    pattern: 'RIZOS GEL FLUIDO',
    modoDeUso: 'Sobre el cabello húmedo después de aplicar Crema de Peinar, aplicar en cantidad moderada Gel Fluido Moldeador, mechón a mechón y dejar en el cabello.',
  },

  // === SHOTS ===
  {
    pattern: 'SHOT PREVENCION PUNTAS ABIERTAS',
    modoDeUso: 'Lavar el cabello con el shampoo de rutina de Prokpil. Mezclar el Shot Prevención Puntas Abiertas con las mascarillas de Prokpil de preferencia (exceptuando Blanco Polar), o aplicar directamente sobre el cabello. Con el cabello húmedo, dejar actuar entre 5 y 10 minutos y enjuagar hasta retirar por completo el producto.',
  },
  {
    pattern: 'SHOT PREVENCION QUIEBRE CAPILAR',
    modoDeUso: 'Lavar el cabello con el shampoo de rutina de Prokpil. Mezclar el Shot Prevención de Quiebre Capilar con las mascarillas de Prokpil de preferencia (exceptuando Blanco Polar), o aplicar directamente sobre el cabello. Con el cabello húmedo, dejar actuar entre 5 y 10 minutos y enjuagar hasta retirar por completo el producto.',
  },
];

async function main() {
  let totalUpdated = 0;

  for (const { pattern, modoDeUso } of updates) {
    // For "COBRE " (with space) we need special handling to not match "COBRE DORADO"
    const productos = await prisma.producto.findMany({
      where: {
        marcaId: '5736eff8-0952-4e68-9c7b-cc70eebc9dbf',
        nombre: { contains: pattern.trim(), mode: 'insensitive' },
      },
      select: { id: true, nombre: true },
    });

    // Filter out COBRE DORADO when pattern is just "COBRE "
    const filtered = pattern === 'MANTENIMIENTO COLOR COBRE '
      ? productos.filter(p => !p.nombre.includes('DORADO'))
      : productos;

    for (const p of filtered) {
      await prisma.producto.update({
        where: { id: p.id },
        data: { modoDeUso },
      });
      console.log(`✓ ${p.nombre}`);
      totalUpdated++;
    }
  }

  console.log(`\nTotal actualizado: ${totalUpdated} productos`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
