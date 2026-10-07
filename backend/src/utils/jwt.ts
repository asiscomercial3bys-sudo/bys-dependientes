import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'dev-secret';

export interface JwtPayload {
  role?: 'dependiente' | 'asesor' | 'admin';
  dependienteId?: string;
  asesorId?: string;
  adminId?: string;
  nitTienda?: string;
}

export function firmarToken(payload: JwtPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export function verificarToken(token: string): JwtPayload {
  return jwt.verify(token, SECRET) as JwtPayload;
}
