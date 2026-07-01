import { Router, Request, Response } from 'express';
import prisma from '../db';
import { authJwt } from '../middleware/authJwt';

const router = Router();

router.get('/resumen', authJwt, async (req: Request, res: Response) => {
  try {
    const dependienteId = req.user!.dependienteId;

    const [totalResult, ultimasVentas, niveles] = await Promise.all([
      prisma.venta.aggregate({
        where: { dependienteId },
        _sum: { puntosGanados: true },
      }),
      prisma.venta.findMany({
        where: { dependienteId },
        include: { producto: { select: { nombre: true } } },
        orderBy: { fecha: 'desc' },
        take: 20,
      }),
      prisma.nivelPremio.findMany({ orderBy: { puntosMinimos: 'asc' } }),
    ]);

    const totalPuntos = totalResult._sum.puntosGanados ?? 0;

    let nivelActual = null;
    let siguienteNivel = null;
    for (let i = 0; i < niveles.length; i++) {
      if (totalPuntos >= niveles[i].puntosMinimos) {
        nivelActual = niveles[i];
      } else {
        siguienteNivel = niveles[i];
        break;
      }
    }

    res.json({
      totalPuntos,
      nivelActual,
      siguienteNivel,
      puntosFaltantes: siguienteNivel ? siguienteNivel.puntosMinimos - totalPuntos : 0,
      ultimasVentas: ultimasVentas.map((v) => ({
        id: v.id,
        producto: v.producto.nombre,
        cantidad: v.cantidad,
        puntosGanados: v.puntosGanados,
        fecha: v.fecha,
      })),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error interno' });
  }
});

export default router;
