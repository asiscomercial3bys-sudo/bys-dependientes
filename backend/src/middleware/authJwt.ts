import { Request, Response, NextFunction } from 'express';
import { verificarToken, JwtPayload } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authJwt(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token requerido' });
    return;
  }
  try {
    req.user = verificarToken(header.slice(7));
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

export function requireRole(role: 'asesor' | 'admin') {
  return (req: Request, res: Response, next: NextFunction): void => {
    authJwt(req, res, () => {
      if (req.user?.role !== role) {
        res.status(403).json({ error: 'No tienes permisos para esta operación' });
        return;
      }
      next();
    });
  };
}
