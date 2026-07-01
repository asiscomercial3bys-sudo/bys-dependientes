import { Router, Request, Response } from 'express';
import prisma from '../db';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const [marcas, niveles, textoPremios] = await Promise.all([
      prisma.marca.findMany({ orderBy: { orden: 'asc' } }),
      prisma.nivelPremio.findMany({ orderBy: { puntosMinimos: 'asc' } }),
      prisma.config.findUnique({ where: { clave: 'texto_premios' } }),
    ]);

    res.json({
      marcas,
      niveles,
      textoPremios: textoPremios?.valor ?? '',
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error interno' });
  }
});

export default router;
