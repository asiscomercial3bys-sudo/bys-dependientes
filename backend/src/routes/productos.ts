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
      omit: { precio: true },
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
    // Algunos escáneres anteponen un identificador de simbología (ej: ]C1, ]E0):
    // siempre "]" + 2 caracteres. Lo quitamos para dejar el código real.
    let code = String(req.params.code).trim();
    if (code.startsWith(']') && code.length > 3) code = code.slice(3);

    // Algunos lectores UPC-A envían 12 dígitos mientras la base los guarda
    // como EAN-13 con cero inicial. También aceptamos el código interno.
    const codigos = [code];
    if (/^\d{12}$/.test(code)) codigos.push(`0${code}`);
    if (/^0\d{12}$/.test(code)) codigos.push(code.slice(1));

    const producto = await prisma.producto.findFirst({
      where: {
        OR: [
          { codigoBarras: { in: codigos } },
          { codigo: { in: codigos } },
        ],
      },
      include: { marca: { select: { nombre: true, imagenUrl: true } } },
      omit: { precio: true },
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
