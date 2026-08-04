import { Router, Request, Response } from 'express';
import prisma from '../db';

const router = Router();
const MESES_VENCIMIENTO = 6;

router.post('/sync', async (req: Request, res: Response) => {
  const apiKey = req.headers['x-api-key'];
  if (!process.env.AUTORIZAR_API_KEY || apiKey !== process.env.AUTORIZAR_API_KEY) {
    res.status(401).json({ error: 'API key requerida' });
    return;
  }

  const siigoUrl = process.env.SIIGO_API_URL;
  if (!siigoUrl) {
    res.status(500).json({ error: 'SIIGO_API_URL no configurada' });
    return;
  }

  try {
    const pendientes = await prisma.venta.findMany({
      where: { estado: 'pendiente' },
      include: {
        dependiente: { select: { nitTienda: true } },
        producto: { select: { codigo: true, nombre: true } },
      },
    });

    if (pendientes.length === 0) {
      res.json({ ok: true, mensaje: 'No hay ventas pendientes', autorizadas: 0 });
      return;
    }

    const conCodigo = pendientes.filter(v => v.producto.codigo);
    const paresUnicos = [
      ...new Map(
        conCodigo.map(v => [
          `${v.dependiente.nitTienda}|${v.producto.codigo}`,
          { nit: v.dependiente.nitTienda, codigo_producto: v.producto.codigo! },
        ])
      ).values(),
    ];

    const siigoRes = await fetch(`${siigoUrl}/validar_sellin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      body: JSON.stringify({ pares: paresUnicos }),
    });

    if (!siigoRes.ok) {
      const txt = await siigoRes.text();
      res.status(502).json({ error: 'Error consultando API Siigo', detalle: txt });
      return;
    }

    const { validados } = (await siigoRes.json()) as {
      validados: { nit: string; codigo_producto: string; confirmado: boolean }[];
    };

    const confirmados = new Set(
      validados
        .filter(v => v.confirmado)
        .map(v => `${v.nit}|${v.codigo_producto}`)
    );

    const ahora = new Date();
    const fechaVenc = new Date(ahora);
    fechaVenc.setMonth(fechaVenc.getMonth() + MESES_VENCIMIENTO);

    const idsAutorizar = conCodigo
      .filter(v => confirmados.has(`${v.dependiente.nitTienda}|${v.producto.codigo}`))
      .map(v => v.id);

    let autorizadas = 0;
    if (idsAutorizar.length > 0) {
      const result = await prisma.venta.updateMany({
        where: { id: { in: idsAutorizar } },
        data: {
          estado: 'autorizado',
          fechaAutorizacion: ahora,
          fechaVencimiento: fechaVenc,
        },
      });
      autorizadas = result.count;
    }

    res.json({
      ok: true,
      mensaje: 'Sincronización completada',
      pendientes: pendientes.length,
      autorizadas,
      sinCodigo: pendientes.length - conCodigo.length,
    });
  } catch (e: any) {
    console.error('Error en sincronización:', e);
    res.status(500).json({ error: 'Error interno', detalle: e?.message || String(e) });
  }
});

export default router;
