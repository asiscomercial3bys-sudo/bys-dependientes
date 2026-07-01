const auth = {
  getUser() {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  },
  getToken() {
    return localStorage.getItem('token');
  },
  isLoggedIn() {
    return !!this.getToken();
  },
  save(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
  updateUser(data) {
    const user = this.getUser();
    if (user) {
      Object.assign(user, data);
      localStorage.setItem('user', JSON.stringify(user));
    }
  },
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.navigate('login');
  },
};
