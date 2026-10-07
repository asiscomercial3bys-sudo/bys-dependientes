import { Router, Request, Response } from 'express';
import prisma from '../db';
import { verificarPin } from '../utils/hash';
import { firmarToken } from '../utils/jwt';
import { requireRole } from '../middleware/authJwt';

const router = Router();

async function clienteAsignado(asesorId: string, nitTienda: string) {
  return prisma.asesorTienda.findUnique({
    where: { asesorId_nitTienda: { asesorId, nitTienda } },
  });
}

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { usuario, pin } = req.body;
    if (!usuario || !pin) {
      res.status(400).json({ error: 'usuario y pin son requeridos' });
      return;
    }
    const asesor = await prisma.asesor.findUnique({ where: { usuario } });
    if (!asesor || !asesor.activo || !verificarPin(pin, asesor.pinHash)) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }
    res.json({
      token: firmarToken({ role: 'asesor', asesorId: asesor.id }),
      asesor: { id: asesor.id, nombre: asesor.nombre, usuario: asesor.usuario },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error interno' });
  }
});

router.get('/clientes', requireRole('asesor'), async (req: Request, res: Response) => {
  try {
    const asesorId = req.user!.asesorId!;
    const asignaciones = await prisma.asesorTienda.findMany({
      where: { asesorId },
      include: {
        tienda: {
          include: {
            inventarios: { orderBy: { fecha: 'desc' }, take: 1, select: { fecha: true } },
          },
        },
      },
      orderBy: { tienda: { nombre: 'asc' } },
    });
    res.json(asignaciones.map(({ tienda }) => ({
      nit: tienda.nit,
      nombre: tienda.nombre,
      inventarioHabilitado: tienda.inventarioHabilitado,
      ultimoInventario: tienda.inventarios[0]?.fecha ?? null,
    })));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error interno' });
  }
});

router.get('/clientes/:nit/productos', requireRole('asesor'), async (req: Request, res: Response) => {
  try {
    const asesorId = req.user!.asesorId!;
    const nitTienda = String(req.params.nit);
    if (!await clienteAsignado(asesorId, nitTienda)) {
      res.status(403).json({ error: 'Este cliente no está asignado a tu cuenta' });
      return;
    }

    const ultimo = await prisma.inventario.findFirst({
      where: { nitTienda }, orderBy: { fecha: 'desc' }, include: { detalles: true },
    });
    const cantidades = new Map((ultimo?.detalles ?? []).map(d => [d.productoId, d.cantidad]));
    const productos = await prisma.producto.findMany({
      include: { marca: { select: { nombre: true } } }, orderBy: [{ marca: { nombre: 'asc' } }, { nombre: 'asc' }],
    });
    res.json(productos.map(p => ({
      id: p.id, nombre: p.nombre, codigo: p.codigo, marca: p.marca.nombre,
      cantidadAnterior: cantidades.get(p.id) ?? 0,
    })));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error interno' });
  }
});

router.post('/inventarios', requireRole('asesor'), async (req: Request, res: Response) => {
  try {
    const asesorId = req.user!.asesorId!;
    const { nitTienda, items, observacion } = req.body as {
      nitTienda?: string; items?: { productoId?: string; cantidad?: number }[]; observacion?: string;
    };
    if (!nitTienda || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'nitTienda e items son requeridos' });
      return;
    }
    if (!await clienteAsignado(asesorId, nitTienda)) {
      res.status(403).json({ error: 'Este cliente no está asignado a tu cuenta' });
      return;
    }

    const seen = new Set<string>();
    for (const item of items) {
      if (!item.productoId || typeof item.cantidad !== 'number' || !Number.isInteger(item.cantidad) || item.cantidad < 0 || seen.has(item.productoId)) {
        res.status(400).json({ error: 'Cada producto debe aparecer una sola vez con una cantidad entera igual o mayor a cero' });
        return;
      }
      seen.add(item.productoId);
    }
    const existentes = await prisma.producto.count({ where: { id: { in: items.map(i => i.productoId!) } } });
    if (existentes !== items.length) {
      res.status(400).json({ error: 'Uno o más productos no existen' });
      return;
    }

    const inventario = await prisma.$transaction(async tx => {
      const nuevo = await tx.inventario.create({
        data: {
          nitTienda, asesorId, observacion: observacion?.trim() || null,
          detalles: { create: items.map(i => ({ productoId: i.productoId!, cantidad: Number(i.cantidad) })) },
        },
        include: { detalles: true },
      });
      await tx.tienda.update({
        where: { nit: nitTienda },
        data: { inventarioHabilitado: true, inventarioInicializadoEn: new Date() },
      });
      return nuevo;
    });

    res.status(201).json({ id: inventario.id, fecha: inventario.fecha, items: inventario.detalles.length, habilitada: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error interno' });
  }
});

export default router;
