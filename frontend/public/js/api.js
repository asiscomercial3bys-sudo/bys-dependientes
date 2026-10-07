const API_BASE = (() => {
  const h = window.location.hostname;
  if (h === 'localhost' || h === '127.0.0.1') return 'http://localhost:3000';
  if (h.match(/^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/)) return `http://${h}:3000`;
  return '';
})();

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw { status: res.status, ...data };
  return data;
}

async function roleFetch(path, tokenKey, options = {}) {
  const token = localStorage.getItem(tokenKey);
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
  productoPorBarcode: (code) => apiFetch(`/productos/barcode/${encodeURIComponent(code)}`),
  registrarVenta: (body) => apiFetch('/ventas', { method: 'POST', body: JSON.stringify(body) }),
  resumenPuntos: () => apiFetch('/puntos/resumen'),
  actualizarPerfil: (body) => apiFetch('/perfil', { method: 'PATCH', body: JSON.stringify(body) }),
  asesorLogin: (body) => apiFetch('/asesores/login', { method: 'POST', body: JSON.stringify(body) }),
  asesorClientes: () => roleFetch('/asesores/clientes', 'asesorToken'),
  asesorProductos: (nit) => roleFetch(`/asesores/clientes/${encodeURIComponent(nit)}/productos`, 'asesorToken'),
  guardarInventario: (body) => roleFetch('/asesores/inventarios', 'asesorToken', { method: 'POST', body: JSON.stringify(body) }),
  adminBootstrap: (body) => apiFetch('/admin/bootstrap', { method: 'POST', body: JSON.stringify(body) }),
  adminLogin: (body) => apiFetch('/admin/login', { method: 'POST', body: JSON.stringify(body) }),
  adminResumen: () => roleFetch('/admin/resumen', 'adminToken'),
  crearAsesor: (body) => roleFetch('/admin/asesores', 'adminToken', { method: 'POST', body: JSON.stringify(body) }),
  crearTienda: (body) => roleFetch('/admin/tiendas', 'adminToken', { method: 'POST', body: JSON.stringify(body) }),
  asignarCliente: (body) => roleFetch('/admin/asignaciones', 'adminToken', { method: 'POST', body: JSON.stringify(body) }),
};
