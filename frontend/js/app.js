function showToast(msg, duration = 2500) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), duration);
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

window.pageInit = {
  login() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const recoverForm = document.getElementById('recover-form');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const showRecover = document.getElementById('show-recover');
    const showLoginFromRecover = document.getElementById('show-login-from-recover');
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    const recoverSection = document.getElementById('recover-section');
    const loginError = document.getElementById('login-error');
    const registerMsg = document.getElementById('register-msg');
    const recoverMsg = document.getElementById('recover-msg');

    function hideAll() {
      loginSection.style.display = 'none';
      registerSection.style.display = 'none';
      recoverSection.style.display = 'none';
    }
    showRegister.onclick = (e) => { e.preventDefault(); hideAll(); registerSection.style.display = 'block'; };
    showLogin.onclick = (e) => { e.preventDefault(); hideAll(); loginSection.style.display = 'block'; };
    showRecover.onclick = (e) => { e.preventDefault(); hideAll(); recoverSection.style.display = 'block'; };
    showLoginFromRecover.onclick = (e) => { e.preventDefault(); hideAll(); loginSection.style.display = 'block'; };

    loginForm.onsubmit = async (e) => {
      e.preventDefault();
      loginError.style.display = 'none';
      const nit = loginForm.nit.value.trim();
      const codigoAcceso = loginForm.codigo.value.trim();
      const pin = loginForm.pin.value;
      try {
        const data = await api.login({ nit, codigoAcceso, pin });
        auth.save(data.token, data.dependiente);
        router.navigate('inicio');
      } catch (err) {
        loginError.textContent = err.error || 'Error al iniciar sesión';
        loginError.style.display = 'block';
      }
    };

    registerForm.onsubmit = async (e) => {
      e.preventDefault();
      registerMsg.style.display = 'none';
      registerMsg.className = 'alert';
      const nombre = registerForm.nombre.value.trim();
      const nitTienda = registerForm.nitTienda.value.trim();
      const pin = registerForm.regPin.value;
      try {
        const data = await api.registrar({ nombre, nitTienda, pin });
        registerMsg.className = 'alert alert-success';
        registerMsg.innerHTML = `¡Registro exitoso! Tu código de acceso es: <strong>${data.codigoAcceso}</strong>. Anótalo, lo necesitas para iniciar sesión.`;
        registerMsg.style.display = 'block';
        registerForm.reset();
      } catch (err) {
        registerMsg.className = 'alert alert-error';
        registerMsg.textContent = err.error || 'Error al registrar';
        registerMsg.style.display = 'block';
      }
    };

    recoverForm.onsubmit = async (e) => {
      e.preventDefault();
      recoverMsg.style.display = 'none';
      recoverMsg.className = 'alert';
      const nit = recoverForm.recNit.value.trim();
      const codigoAcceso = recoverForm.recCodigo.value.trim();
      const nuevoPin = recoverForm.recPin.value;
      try {
        await api.recuperarPin({ nit, codigoAcceso, nuevoPin });
        recoverMsg.className = 'alert alert-success';
        recoverMsg.textContent = 'PIN actualizado. Ya puedes iniciar sesión con tu nuevo PIN.';
        recoverMsg.style.display = 'block';
        recoverForm.reset();
      } catch (err) {
        recoverMsg.className = 'alert alert-error';
        recoverMsg.textContent = err.error || 'Error al recuperar PIN';
        recoverMsg.style.display = 'block';
      }
    };
  },

  async inicio() {
    try {
      const data = await api.inicio();
      const scrollContainer = document.getElementById('brand-scroll');
      if (data.marcas.length) {
        scrollContainer.innerHTML = data.marcas.map((m) =>
          `<div class="brand-item">
            ${m.imagen_url || m.imagenUrl
              ? `<img src="${m.imagen_url || m.imagenUrl}" alt="${m.nombre}">`
              : `<span class="brand-placeholder">${m.nombre}</span>`}
          </div>`
        ).join('');
      } else {
        scrollContainer.innerHTML = '<p style="color:var(--color-muted);font-size:0.85rem;">Aún no hay marcas registradas</p>';
      }

      const textoPremios = document.getElementById('texto-premios');
      textoPremios.textContent = data.textoPremios;

      const nivelesContainer = document.getElementById('niveles-list');
      const badges = { 'bronce': '🥉', 'plata': '🥈', 'oro': '🥇' };
      nivelesContainer.innerHTML = data.niveles.map((n) => {
        const key = n.nombre.toLowerCase();
        return `<div class="nivel-card">
          <div class="nivel-badge ${key}">${badges[key] || '⭐'}</div>
          <div class="nivel-info">
            <h4>${n.nombre} — ${n.puntos_minimos || n.puntosMinimos} pts</h4>
            <p>${n.descripcion_premio || n.descripcionPremio || ''}</p>
          </div>
        </div>`;
      }).join('');
    } catch (err) {
      console.error(err);
    }
  },

  async productos() {
    const searchInput = document.getElementById('product-search');
    const list = document.getElementById('product-list');
    let debounceTimer;

    async function loadProducts(q) {
      try {
        const data = await api.productos(q);
        if (!data.length) {
          list.innerHTML = '<p style="text-align:center;color:var(--color-muted);padding:24px 0;">No se encontraron productos</p>';
          return;
        }
        list.innerHTML = data.map((p) =>
          `<div class="product-card" data-id="${p.id}" data-modo="${encodeURIComponent(p.modo_de_uso || p.modoDeUso || '')}">
            <div class="product-img">
              ${(p.imagen_url || p.imagenUrl)
                ? `<img src="${p.imagen_url || p.imagenUrl}" alt="${p.nombre}">`
                : `<span class="placeholder-icon">📦</span>`}
            </div>
            <div class="product-info">
              <h3>${p.nombre}</h3>
              <span class="brand">${p.marca?.nombre || ''}</span>
            </div>
            <span class="product-points">${p.puntos_por_venta || p.puntosPorVenta} pts</span>
          </div>`
        ).join('');
      } catch (err) {
        list.innerHTML = '<p style="text-align:center;color:var(--color-error);">Error cargando productos</p>';
      }
    }

    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => loadProducts(searchInput.value.trim()), 300);
    });

    list.addEventListener('click', (e) => {
      const card = e.target.closest('.product-card');
      if (!card) return;
      const modo = decodeURIComponent(card.dataset.modo);
      if (modo) {
        const name = card.querySelector('h3').textContent;
        showProductModal(name, modo);
      }
    });

    loadProducts('');
  },

  async venta() {
    const searchInput = document.getElementById('venta-search');
    const list = document.getElementById('venta-product-list');
    const selectedDiv = document.getElementById('venta-selected');
    const cantidadInput = document.getElementById('venta-cantidad');
    const confirmBtn = document.getElementById('venta-confirm');
    const resultDiv = document.getElementById('venta-result');
    let selectedProduct = null;
    let debounceTimer;

    async function search(q) {
      try {
        const data = await api.productos(q);
        list.innerHTML = data.map((p) =>
          `<div class="product-card" data-id="${p.id}" data-name="${p.nombre}" data-pts="${p.puntos_por_venta || p.puntosPorVenta}">
            <div class="product-img">
              ${(p.imagen_url || p.imagenUrl)
                ? `<img src="${p.imagen_url || p.imagenUrl}" alt="${p.nombre}">`
                : `<span class="placeholder-icon">📦</span>`}
            </div>
            <div class="product-info">
              <h3>${p.nombre}</h3>
              <span class="brand">${p.marca?.nombre || ''}</span>
            </div>
            <span class="product-points">${p.puntos_por_venta || p.puntosPorVenta} pts</span>
          </div>`
        ).join('');
      } catch (err) {
        list.innerHTML = '<p style="color:var(--color-error)">Error buscando</p>';
      }
    }

    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => search(searchInput.value.trim()), 300);
    });

    list.addEventListener('click', (e) => {
      const card = e.target.closest('.product-card');
      if (!card) return;
      selectedProduct = { id: card.dataset.id, nombre: card.dataset.name, puntos: parseInt(card.dataset.pts) };
      selectedDiv.innerHTML = `<div class="card card-accent"><strong>${selectedProduct.nombre}</strong> — ${selectedProduct.puntos} pts/unidad</div>`;
      list.style.display = 'none';
      searchInput.style.display = 'none';
      document.getElementById('venta-form-section').style.display = 'block';
    });

    confirmBtn.onclick = async () => {
      if (!selectedProduct) return;
      const cantidad = parseInt(cantidadInput.value);
      if (!cantidad || cantidad < 1) { showToast('Ingresa una cantidad válida'); return; }
      confirmBtn.disabled = true;
      try {
        const data = await api.registrarVenta({ productoId: selectedProduct.id, cantidad });
        document.getElementById('venta-form-section').style.display = 'none';
        selectedDiv.innerHTML = '';
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
          <div class="venta-result">
            <p style="margin-bottom:8px;">¡Venta registrada!</p>
            <p class="points-earned">+${data.puntosGanados} pts</p>
            <p style="color:var(--color-muted);margin-top:8px;">${data.producto} × ${data.cantidad}</p>
            <button class="btn btn-primary" style="margin-top:24px;" onclick="router.navigate('venta')">Registrar otra</button>
            <button class="btn btn-outline" style="margin-top:8px;" onclick="router.navigate('puntos')">Ver mis puntos</button>
          </div>`;
      } catch (err) {
        showToast(err.error || 'Error registrando venta');
        confirmBtn.disabled = false;
      }
    };

    search('');
  },

  async puntos() {
    try {
      const data = await api.resumenPuntos();
      document.getElementById('total-puntos').textContent = data.totalPuntos;

      const nivelEl = document.getElementById('nivel-actual');
      nivelEl.textContent = data.nivelActual ? data.nivelActual.nombre : 'Sin nivel';

      const progressBar = document.getElementById('progress-fill');
      const progressText = document.getElementById('progress-text');
      if (data.siguienteNivel) {
        const prevMin = data.nivelActual ? data.nivelActual.puntosMinimos || data.nivelActual.puntos_minimos : 0;
        const nextMin = data.siguienteNivel.puntosMinimos || data.siguienteNivel.puntos_minimos;
        const range = nextMin - prevMin;
        const progress = range > 0 ? Math.min(((data.totalPuntos - prevMin) / range) * 100, 100) : 0;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `Faltan ${data.puntosFaltantes} pts para ${data.siguienteNivel.nombre}`;
      } else {
        progressBar.style.width = '100%';
        progressText.textContent = '¡Nivel máximo alcanzado!';
      }

      const historial = document.getElementById('historial-ventas');
      if (data.ultimasVentas.length) {
        historial.innerHTML = data.ultimasVentas.map((v) =>
          `<div class="venta-item">
            <div>
              <div class="venta-producto">${v.producto} × ${v.cantidad}</div>
              <div class="venta-fecha">${formatDate(v.fecha)}</div>
            </div>
            <span class="venta-puntos">+${v.puntosGanados}</span>
          </div>`
        ).join('');
      } else {
        historial.innerHTML = '<p style="text-align:center;color:var(--color-muted);padding:16px 0;">Aún no has registrado ventas</p>';
      }
    } catch (err) {
      console.error(err);
    }
  },

  config() {
    const user = auth.getUser();
    if (!user) return;
    document.getElementById('config-nombre').value = user.nombre;
    document.getElementById('config-codigo').textContent = user.codigoAcceso;
    document.getElementById('config-tienda').textContent = `${user.tienda} (${user.nitTienda})`;

    document.getElementById('config-form').onsubmit = async (e) => {
      e.preventDefault();
      const nombre = document.getElementById('config-nombre').value.trim();
      if (!nombre) return;
      try {
        const data = await api.actualizarPerfil({ nombre });
        auth.updateUser(data);
        showToast('Nombre actualizado');
      } catch (err) {
        showToast(err.error || 'Error actualizando');
      }
    };

    document.getElementById('btn-logout').onclick = () => auth.logout();
  },
};

function showProductModal(name, modo) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-sheet">
      <h2 class="section-title" style="margin-bottom:16px;">${name}</h2>
      <p style="line-height:1.6;">${modo}</p>
      <button class="btn btn-primary" style="margin-top:20px;" id="close-modal">Cerrar</button>
    </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.id === 'close-modal') overlay.remove();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
  router.init();
});
