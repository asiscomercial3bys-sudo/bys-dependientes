import { readFileSync, writeFileSync } from 'fs';

const data = JSON.parse(readFileSync('export.json', 'utf-8'));

function esc(v: any): string {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  if (typeof v === 'number') return String(v);
  return `'${String(v).replace(/'/g, "''")}'`;
}

let sql = '';

// Tiendas
for (const t of data.tiendas) {
  sql += `INSERT INTO "tiendas" ("nit","nombre","activa") VALUES (${esc(t.nit)},${esc(t.nombre)},${esc(t.activa)});\n`;
}

// Marcas
for (const m of data.marcas) {
  sql += `INSERT INTO "marcas" ("id","nombre","imagen_url","orden") VALUES (${esc(m.id)},${esc(m.nombre)},${esc(m.imagenUrl)},${esc(m.orden)});\n`;
}

// Productos
for (const p of data.productos) {
  sql += `INSERT INTO "productos" ("id","codigo","nombre","marca_id","modo_de_uso","imagen_url","puntos_por_venta","codigo_barras") VALUES (${esc(p.id)},${esc(p.codigo)},${esc(p.nombre)},${esc(p.marcaId)},${esc(p.modoDeUso)},${esc(p.imagenUrl)},${esc(p.puntosPorVenta)},${esc(p.codigoBarras)});\n`;
}

// Niveles
for (const n of data.niveles) {
  sql += `INSERT INTO "niveles_premio" ("id","nombre","puntos_minimos","descripcion_premio") VALUES (${esc(n.id)},${esc(n.nombre)},${esc(n.puntosMinimos)},${esc(n.descripcionPremio)});\n`;
}

// Config
for (const c of data.config) {
  sql += `INSERT INTO "config" ("clave","valor") VALUES (${esc(c.clave)},${esc(c.valor)});\n`;
}

writeFileSync('insert-data.sql', sql);
console.log(`Generated ${sql.split('\n').length} SQL statements`);
