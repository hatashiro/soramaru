export function setUser({ dispatch }, user) {
  dispatch('SET_USER', user);
}

export function toggleMenu({ dispatch }) {
  dispatch('TOGGLE_MENU');
  document.body.style.overflow = this.menuOpen ? 'hidden' : '';
}
