import { Router, Request, Response } from 'express';
import { customAlphabet } from 'nanoid';
import prisma from '../db';
import { hashPin, verificarPin } from '../utils/hash';
import { firmarToken } from '../utils/jwt';

const router = Router();
const generarCodigo = customAlphabet('0123456789', 6);

router.post('/registrar', async (req: Request, res: Response) => {
  try {
    const { nombre, nitTienda, pin } = req.body;
    if (!nombre || !nitTienda || !pin) {
      res.status(400).json({ error: 'nombre, nitTienda y pin son requeridos' });
      return;
    }
    if (pin.length < 4) {
      res.status(400).json({ error: 'El PIN debe tener al menos 4 dígitos' });
      return;
    }

    const tienda = await prisma.tienda.findUnique({ where: { nit: nitTienda } });
    if (!tienda || !tienda.activa) {
      res.status(404).json({ error: 'Tienda no encontrada o inactiva' });
      return;
    }

    const codigoAcceso = generarCodigo();
    const dependiente = await prisma.dependiente.create({
      data: {
        nombre,
        nitTienda,
        codigoAcceso,
        pinHash: hashPin(pin),
      },
    });

    res.status(201).json({
      id: dependiente.id,
      nombre: dependiente.nombre,
      codigoAcceso: dependiente.codigoAcceso,
      tienda: tienda.nombre,
    });
  } catch (e: any) {
    if (e.code === 'P2002') {
      res.status(409).json({ error: 'Código de acceso duplicado, intenta de nuevo' });
      return;
    }
    console.error(e);
    res.status(500).json({ error: 'Error interno' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { nit, codigoAcceso, pin } = req.body;
    if (!nit || !codigoAcceso || !pin) {
      res.status(400).json({ error: 'nit, codigoAcceso y pin son requeridos' });
      return;
    }

    const dependiente = await prisma.dependiente.findUnique({
      where: { codigoAcceso },
      include: { tienda: true },
    });

    if (!dependiente || dependiente.nitTienda !== nit) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }
    if (!dependiente.tienda.activa) {
      res.status(403).json({ error: 'Tienda inactiva' });
      return;
    }
    if (!verificarPin(pin, dependiente.pinHash)) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    const token = firmarToken({ dependienteId: dependiente.id, nitTienda: dependiente.nitTienda });
    res.json({
      token,
      dependiente: {
        id: dependiente.id,
        nombre: dependiente.nombre,
        codigoAcceso: dependiente.codigoAcceso,
        tienda: dependiente.tienda.nombre,
        nitTienda: dependiente.nitTienda,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error interno' });
  }
});

router.post('/recuperar-pin', async (req: Request, res: Response) => {
  try {
    const { nit, codigoAcceso, nuevoPin } = req.body;
    if (!nit || !codigoAcceso || !nuevoPin) {
      res.status(400).json({ error: 'nit, codigoAcceso y nuevoPin son requeridos' });
      return;
    }
    if (nuevoPin.length < 4) {
      res.status(400).json({ error: 'El PIN debe tener al menos 4 dígitos' });
      return;
    }

    const dependiente = await prisma.dependiente.findUnique({ where: { codigoAcceso } });
    if (!dependiente || dependiente.nitTienda !== nit) {
      res.status(404).json({ error: 'Dependiente no encontrada' });
      return;
    }

    await prisma.dependiente.update({
      where: { id: dependiente.id },
      data: { pinHash: hashPin(nuevoPin) },
    });

    res.json({ mensaje: 'PIN actualizado correctamente' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error interno' });
  }
});

export default router;
