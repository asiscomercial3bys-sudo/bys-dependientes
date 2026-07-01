const router = {
  _currentPage: null,

  loadPage(name) {
    const template = document.getElementById(`page-${name}`);
    if (!template) return '';
    return template.innerHTML;
  },

  navigate(page) {
    if (!auth.isLoggedIn() && page !== 'login') {
      page = 'login';
    }
    if (auth.isLoggedIn() && page === 'login') {
      page = 'inicio';
    }

    this._currentPage = page;
    const html = this.loadPage(page);
    document.getElementById('app').innerHTML = html;

    this.updateNav(page);
    this.updateTopbar(page);

    if (window.pageInit && window.pageInit[page]) {
      window.pageInit[page]();
    }

    history.pushState({ page }, '', `#${page}`);
  },

  updateNav(page) {
    document.querySelectorAll('.nav-item').forEach((el) => {
      el.classList.toggle('active', el.dataset.page === page);
    });
  },

  updateTopbar(page) {
    const titles = {
      inicio: 'B&S DEPENDIENTES',
      productos: 'Modos de uso',
      venta: 'Registrar Venta',
      puntos: 'Mis Puntos',
      config: 'Configuración',
    };
    const topTitle = document.getElementById('topbar-title');
    if (topTitle) topTitle.textContent = titles[page] || 'B&S DEPENDIENTES';

    const topbar = document.getElementById('topbar');
    const navbar = document.getElementById('navbar');
    if (page === 'login') {
      topbar && (topbar.style.display = 'none');
      navbar && (navbar.style.display = 'none');
      document.getElementById('app').style.paddingTop = '0';
      document.getElementById('app').style.paddingBottom = '0';
    } else {
      topbar && (topbar.style.display = '');
      navbar && (navbar.style.display = '');
      document.getElementById('app').style.paddingTop = '';
      document.getElementById('app').style.paddingBottom = '';
    }
  },

  init() {
    window.addEventListener('popstate', (e) => {
      if (e.state?.page) this.navigate(e.state.page);
    });
    const hash = location.hash.slice(1);
    this.navigate(hash || (auth.isLoggedIn() ? 'inicio' : 'login'));
  },
};
