<template>
</template>

<script>
import store from './store';

export default {
  async created() {
    let res;
    try {
      res = await this.$http.get('/session');
    } catch (res) {
      if (res.status === 401) {
        this.$router.go('/login');
        return;
      }
      throw res;
    }
    this.setUser(res.json());
  },
  store,
  vuex: {
    actions: {
      setUser({ dispatch }, user) {
        dispatch('SET_USER', user);
      }
    },
    getters: {
      user: state => state.user
    }
  }
};
</script>

<style>
</style>
