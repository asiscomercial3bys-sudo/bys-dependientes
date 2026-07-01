import express from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/auth';
import inicioRoutes from './routes/inicio';
import productosRoutes from './routes/productos';
import ventasRoutes from './routes/ventas';
import puntosRoutes from './routes/puntos';
import perfilRoutes from './routes/perfil';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/inicio', inicioRoutes);
app.use('/productos', productosRoutes);
app.use('/ventas', ventasRoutes);
app.use('/puntos', puntosRoutes);
app.use('/perfil', perfilRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const frontendPath = process.env.FRONTEND_PATH || path.join(__dirname, '../../frontend/public');
app.use(express.static(frontendPath));
app.get('*', (_req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});
