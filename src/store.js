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
};

export const getters = {
  user: state => state.user,
};

export default new Vuex.Store({
  state,
  mutations,
});
