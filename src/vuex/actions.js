export function setUser({ dispatch }, user) {
  dispatch('SET_USER', user);
}

export async function logout({ dispatch }) {
  await this.$http.delete('/session');
  dispatch('LOGOUT');
  this.$router.go('/login');
}

export function toggleMenu({ dispatch, state }) {
  dispatch('TOGGLE_MENU');
  document.body.style.overflow = state.menuOpen ? 'hidden' : '';
}

export function closeMenu({ dispatch }) {
  dispatch('CLOSE_MENU');
  document.body.style.overflow = '';
}

export async function loadLists({ dispatch }) {
  let res;
  try {
    res = await this.$http.get('/twitter/lists');
  } catch (res) {
    if (res.status === 401) {
      this.$router.go('/login');
      return;
    }
    if (res.status === 429) {
      // do nothing
      return;
    }
    throw res;
  }
  dispatch('SET_LISTS', res.json());
}

export async function loadArchives({ dispatch }) {
  let res;
  try {
    res = await this.$http.get('/archives');
  } catch (res) {
    if (res.status === 401) {
      this.$router.go('/login');
      return;
    }
    throw res;
  }
  dispatch('SET_ARCHIVES', res.json());
}
