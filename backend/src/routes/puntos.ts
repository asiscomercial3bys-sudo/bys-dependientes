import { Router, Request, Response } from 'express';
import prisma from '../db';
import { authJwt } from '../middleware/authJwt';

const router = Router();

const DIAS_AVISO_VENCIMIENTO = 30;

router.get('/resumen', authJwt, async (req: Request, res: Response) => {
  try {
    const dependienteId = req.user!.dependienteId;

    const ventas = await prisma.venta.findMany({
      where: { dependienteId },
      include: { producto: { select: { nombre: true } } },
      orderBy: { fecha: 'desc' },
    });

    const ahora = new Date();
    const limiteAviso = new Date(ahora.getTime() + DIAS_AVISO_VENCIMIENTO * 24 * 60 * 60 * 1000);

    let ganados = 0;        // total histórico ganado
    let porRedimir = 0;     // autorizados y vigentes
    let porVencer = 0;      // autorizados que vencen pronto (subconjunto de por redimir)
    let redimidos = 0;      // ya canjeados
    let vencidos = 0;       // autorizados que ya vencieron
    let pendientes = 0;     // ganados esperando validación de factura sell-in
    let proximoVencimiento: Date | null = null;

    const movimientos = ventas.map((v) => {
      ganados += v.puntosGanados;
      let estadoDisplay = v.estado;

      if (v.estado === 'redimido') {
        redimidos += v.puntosGanados;
      } else if (v.estado === 'autorizado') {
        const vencido = v.fechaVencimiento && v.fechaVencimiento <= ahora;
        if (vencido) {
          vencidos += v.puntosGanados;
          estadoDisplay = 'vencido';
        } else {
          porRedimir += v.puntosGanados;
          estadoDisplay = 'disponible';
          if (v.fechaVencimiento && v.fechaVencimiento <= limiteAviso) {
            porVencer += v.puntosGanados;
            estadoDisplay = 'por_vencer';
          }
          if (v.fechaVencimiento && (!proximoVencimiento || v.fechaVencimiento < proximoVencimiento)) {
            proximoVencimiento = v.fechaVencimiento;
          }
        }
      } else {
        pendientes += v.puntosGanados;
        estadoDisplay = 'pendiente';
      }

      return {
        id: v.id,
        producto: v.producto.nombre,
        cantidad: v.cantidad,
        puntosGanados: v.puntosGanados,
        fecha: v.fecha,
        estado: estadoDisplay,
        fechaVencimiento: v.fechaVencimiento,
      };
    });

    res.json({
      ganados,
      porRedimir,
      porVencer,
      redimidos,
      vencidos,
      pendientes,
      proximoVencimiento,
      movimientos,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error interno' });
  }
});

export default router;
