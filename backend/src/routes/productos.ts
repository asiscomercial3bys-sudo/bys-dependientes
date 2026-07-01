import { Router, Request, Response } from 'express';
import prisma from '../db';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string || '').trim();
    const where = q
      ? {
          OR: [
            { nombre: { contains: q, mode: 'insensitive' as const } },
            { marca: { nombre: { contains: q, mode: 'insensitive' as const } } },
          ],
        }
      : {};

    const productos = await prisma.producto.findMany({
      where,
      include: { marca: { select: { nombre: true, imagenUrl: true } } },
      orderBy: { nombre: 'asc' },
      take: 50,
    });

    res.json(productos);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error interno' });
  }
});

router.get('/barcode/:code', async (req: Request, res: Response) => {
  try {
    const producto = await prisma.producto.findFirst({
      where: { codigoBarras: req.params.code },
      include: { marca: { select: { nombre: true, imagenUrl: true } } },
    });
    if (!producto) {
      res.status(404).json({ error: 'Producto no encontrado con ese código de barras' });
      return;
    }
    res.json(producto);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error interno' });
  }
});

export default router;
