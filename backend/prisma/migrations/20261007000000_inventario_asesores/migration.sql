ALTER TABLE "tiendas"
  ADD COLUMN "inventario_habilitado" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "inventario_inicializado_en" TIMESTAMP(3);

CREATE TABLE "asesores" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "nombre" TEXT NOT NULL,
  "usuario" TEXT NOT NULL,
  "pin_hash" TEXT NOT NULL,
  "activo" BOOLEAN NOT NULL DEFAULT true,
  "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "asesores_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "asesores_usuario_key" ON "asesores"("usuario");

CREATE TABLE "administradores" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "nombre" TEXT NOT NULL,
  "usuario" TEXT NOT NULL,
  "pin_hash" TEXT NOT NULL,
  "activo" BOOLEAN NOT NULL DEFAULT true,
  "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "administradores_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "administradores_usuario_key" ON "administradores"("usuario");

CREATE TABLE "asesores_tiendas" (
  "asesor_id" UUID NOT NULL,
  "nit_tienda" TEXT NOT NULL,
  "asignado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "asesores_tiendas_pkey" PRIMARY KEY ("asesor_id", "nit_tienda")
);

CREATE TABLE "inventarios" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "nit_tienda" TEXT NOT NULL,
  "asesor_id" UUID NOT NULL,
  "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "observacion" TEXT,
  CONSTRAINT "inventarios_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "inventarios_nit_tienda_fecha_idx" ON "inventarios"("nit_tienda", "fecha");

CREATE TABLE "inventario_detalles" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "inventario_id" UUID NOT NULL,
  "producto_id" UUID NOT NULL,
  "cantidad" INTEGER NOT NULL,
  CONSTRAINT "inventario_detalles_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "inventario_detalles_inventario_id_producto_id_key" ON "inventario_detalles"("inventario_id", "producto_id");

ALTER TABLE "asesores_tiendas" ADD CONSTRAINT "asesores_tiendas_asesor_id_fkey" FOREIGN KEY ("asesor_id") REFERENCES "asesores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "asesores_tiendas" ADD CONSTRAINT "asesores_tiendas_nit_tienda_fkey" FOREIGN KEY ("nit_tienda") REFERENCES "tiendas"("nit") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "inventarios" ADD CONSTRAINT "inventarios_nit_tienda_fkey" FOREIGN KEY ("nit_tienda") REFERENCES "tiendas"("nit") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "inventarios" ADD CONSTRAINT "inventarios_asesor_id_fkey" FOREIGN KEY ("asesor_id") REFERENCES "asesores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "inventario_detalles" ADD CONSTRAINT "inventario_detalles_inventario_id_fkey" FOREIGN KEY ("inventario_id") REFERENCES "inventarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "inventario_detalles" ADD CONSTRAINT "inventario_detalles_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
