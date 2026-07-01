const API_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:3000'
  : '/api';

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw { status: res.status, ...data };
  return data;
}

const api = {
  registrar: (body) => apiFetch('/auth/registrar', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  recuperarPin: (body) => apiFetch('/auth/recuperar-pin', { method: 'POST', body: JSON.stringify(body) }),
  inicio: () => apiFetch('/inicio'),
  productos: (q = '') => apiFetch(`/productos?q=${encodeURIComponent(q)}`),
  registrarVenta: (body) => apiFetch('/ventas', { method: 'POST', body: JSON.stringify(body) }),
  resumenPuntos: () => apiFetch('/puntos/resumen'),
  actualizarPerfil: (body) => apiFetch('/perfil', { method: 'PATCH', body: JSON.stringify(body) }),
};
