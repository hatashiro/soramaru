import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
  user: null,
  menuOpen: false,
  lists: [],
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
  CLOSE_MENU(state) {
    state.menuOpen = false;
  },
  SET_LISTS(state, lists) {
    state.lists = lists;
  },
};

export default new Vuex.Store({
  state,
  mutations,
});
