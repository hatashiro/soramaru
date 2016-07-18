import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
  user: null
};

const mutations = {
  SET_USER(state, user) {
    state.user = user;
  },
  LOGOUT(state) {
    state.user = null;
  },
  TOGGLE_MENU(state) {
    state.menuOpen = !state.menuOpen;
  },
};

export default new Vuex.Store({
  state,
  mutations,
});
