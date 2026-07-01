-- CreateTable
CREATE TABLE "tiendas" (
    "nit" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tiendas_pkey" PRIMARY KEY ("nit")
);

-- CreateTable
CREATE TABLE "dependientes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" TEXT NOT NULL,
    "nit_tienda" TEXT NOT NULL,
    "codigo_acceso" TEXT NOT NULL,
    "pin_hash" TEXT NOT NULL,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dependientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marcas" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" TEXT NOT NULL,
    "imagen_url" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "marcas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" TEXT NOT NULL,
    "marca_id" UUID NOT NULL,
    "modo_de_uso" TEXT,
    "imagen_url" TEXT,
    "puntos_por_venta" INTEGER NOT NULL DEFAULT 10,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ventas" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "dependiente_id" UUID NOT NULL,
    "producto_id" UUID NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "puntos_ganados" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ventas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "niveles_premio" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" TEXT NOT NULL,
    "puntos_minimos" INTEGER NOT NULL,
    "descripcion_premio" TEXT,

    CONSTRAINT "niveles_premio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "config" (
    "clave" TEXT NOT NULL,
    "valor" TEXT NOT NULL,

    CONSTRAINT "config_pkey" PRIMARY KEY ("clave")
);

-- CreateIndex
CREATE UNIQUE INDEX "dependientes_codigo_acceso_key" ON "dependientes"("codigo_acceso");

-- AddForeignKey
ALTER TABLE "dependientes" ADD CONSTRAINT "dependientes_nit_tienda_fkey" FOREIGN KEY ("nit_tienda") REFERENCES "tiendas"("nit") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_marca_id_fkey" FOREIGN KEY ("marca_id") REFERENCES "marcas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_dependiente_id_fkey" FOREIGN KEY ("dependiente_id") REFERENCES "dependientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
