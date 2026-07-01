import { Router, Request, Response } from 'express';
import prisma from '../db';
import { authJwt } from '../middleware/authJwt';
import { calcularPuntos } from '../services/puntos';

const router = Router();

router.post('/', authJwt, async (req: Request, res: Response) => {
  try {
    const { productoId, cantidad } = req.body;
    const dependienteId = req.user!.dependienteId;

    if (!productoId || !cantidad || cantidad < 1) {
      res.status(400).json({ error: 'productoId y cantidad (>= 1) son requeridos' });
      return;
    }

    const producto = await prisma.producto.findUnique({ where: { id: productoId } });
    if (!producto) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }

    const puntosGanados = calcularPuntos(producto.puntosPorVenta, cantidad);

    const venta = await prisma.venta.create({
      data: {
        dependienteId,
        productoId,
        cantidad,
        puntosGanados,
      },
      include: { producto: { select: { nombre: true } } },
    });

    res.status(201).json({
      id: venta.id,
      producto: venta.producto.nombre,
      cantidad: venta.cantidad,
      puntosGanados: venta.puntosGanados,
      fecha: venta.fecha,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error interno' });
  }
});

export default router;
