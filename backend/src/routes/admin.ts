import { Router, Request, Response } from 'express';
import prisma from '../db';
import { hashPin, verificarPin } from '../utils/hash';
import { firmarToken } from '../utils/jwt';
import { requireRole } from '../middleware/authJwt';

const router = Router();

function validarCuenta(nombre: unknown, usuario: unknown, pin: unknown, res: Response): boolean {
  if (typeof nombre !== 'string' || !nombre.trim() || typeof usuario !== 'string' || !usuario.trim() || typeof pin !== 'string' || pin.length < 4) {
    res.status(400).json({ error: 'Nombre, usuario y PIN de al menos 4 caracteres son requeridos' });
    return false;
  }
  return true;
}

router.post('/bootstrap', async (req: Request, res: Response) => {
  try {
    const total = await prisma.administrador.count();
    if (total > 0) {
      res.status(409).json({ error: 'Ya existe una cuenta administradora. Inicia sesión.' });
      return;
    }
    const { nombre, usuario, pin } = req.body;
    if (!validarCuenta(nombre, usuario, pin, res)) return;
    const admin = await prisma.administrador.create({ data: { nombre: nombre.trim(), usuario: usuario.trim(), pinHash: hashPin(pin) } });
    res.status(201).json({ token: firmarToken({ role: 'admin', adminId: admin.id }), admin: { id: admin.id, nombre: admin.nombre, usuario: admin.usuario } });
  } catch (e: any) {
    if (e.code === 'P2002') { res.status(409).json({ error: 'Ese usuario ya existe' }); return; }
    console.error(e); res.status(500).json({ error: 'Error interno' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { usuario, pin } = req.body;
    const admin = await prisma.administrador.findUnique({ where: { usuario } });
    if (!admin || !admin.activo || !verificarPin(pin, admin.pinHash)) { res.status(401).json({ error: 'Credenciales inválidas' }); return; }
    res.json({ token: firmarToken({ role: 'admin', adminId: admin.id }), admin: { id: admin.id, nombre: admin.nombre, usuario: admin.usuario } });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Error interno' }); }
});

router.get('/resumen', requireRole('admin'), async (_req: Request, res: Response) => {
  try {
    const [asesores, tiendas] = await Promise.all([
      prisma.asesor.findMany({ orderBy: { nombre: 'asc' }, include: { asignaciones: { select: { nitTienda: true } } } }),
      prisma.tienda.findMany({ orderBy: { nombre: 'asc' }, include: { asignacionesAsesor: { include: { asesor: { select: { nombre: true } } } } } }),
    ]);
    res.json({
      asesores: asesores.map(a => ({ id: a.id, nombre: a.nombre, usuario: a.usuario, activo: a.activo, clientes: a.asignaciones.map(x => x.nitTienda) })),
      tiendas: tiendas.map(t => ({ nit: t.nit, nombre: t.nombre, inventarioHabilitado: t.inventarioHabilitado, asesores: t.asignacionesAsesor.map(x => x.asesor.nombre) })),
    });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Error interno' }); }
});

router.post('/asesores', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { nombre, usuario, pin } = req.body;
    if (!validarCuenta(nombre, usuario, pin, res)) return;
    const asesor = await prisma.asesor.create({ data: { nombre: nombre.trim(), usuario: usuario.trim(), pinHash: hashPin(pin) } });
    res.status(201).json({ id: asesor.id, nombre: asesor.nombre, usuario: asesor.usuario });
  } catch (e: any) {
    if (e.code === 'P2002') { res.status(409).json({ error: 'Ese usuario ya existe' }); return; }
    console.error(e); res.status(500).json({ error: 'Error interno' });
  }
});

router.post('/tiendas', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { nit, nombre } = req.body;
    if (typeof nit !== 'string' || !nit.trim() || typeof nombre !== 'string' || !nombre.trim()) { res.status(400).json({ error: 'NIT y nombre son requeridos' }); return; }
    const tienda = await prisma.tienda.create({ data: { nit: nit.trim(), nombre: nombre.trim(), inventarioHabilitado: false } });
    res.status(201).json(tienda);
  } catch (e: any) {
    if (e.code === 'P2002') { res.status(409).json({ error: 'Ya existe una tienda con ese NIT' }); return; }
    console.error(e); res.status(500).json({ error: 'Error interno' });
  }
});

router.post('/asignaciones', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { asesorId, nitTienda } = req.body;
    if (!asesorId || !nitTienda) { res.status(400).json({ error: 'asesorId y nitTienda son requeridos' }); return; }
    const [asesor, tienda, inventario] = await Promise.all([
      prisma.asesor.findUnique({ where: { id: asesorId } }),
      prisma.tienda.findUnique({ where: { nit: nitTienda } }),
      prisma.inventario.findFirst({ where: { nitTienda }, select: { id: true } }),
    ]);
    if (!asesor || !tienda) { res.status(404).json({ error: 'Asesor o cliente no encontrado' }); return; }
    await prisma.$transaction([
      prisma.asesorTienda.upsert({ where: { asesorId_nitTienda: { asesorId, nitTienda } }, update: {}, create: { asesorId, nitTienda } }),
      ...(inventario ? [] : [prisma.tienda.update({ where: { nit: nitTienda }, data: { inventarioHabilitado: false } })]),
    ]);
    res.status(201).json({ ok: true, inventarioPendiente: !inventario });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Error interno' }); }
});

export default router;
