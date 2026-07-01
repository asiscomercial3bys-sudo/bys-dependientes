import { Router, Request, Response } from 'express';
import prisma from '../db';
import { authJwt } from '../middleware/authJwt';

const router = Router();

router.patch('/', authJwt, async (req: Request, res: Response) => {
  try {
    const { nombre } = req.body;
    if (!nombre || !nombre.trim()) {
      res.status(400).json({ error: 'nombre es requerido' });
      return;
    }

    const dependiente = await prisma.dependiente.update({
      where: { id: req.user!.dependienteId },
      data: { nombre: nombre.trim() },
      include: { tienda: { select: { nombre: true } } },
    });

    res.json({
      id: dependiente.id,
      nombre: dependiente.nombre,
      codigoAcceso: dependiente.codigoAcceso,
      tienda: dependiente.tienda.nombre,
      nitTienda: dependiente.nitTienda,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error interno' });
  }
});

export default router;
