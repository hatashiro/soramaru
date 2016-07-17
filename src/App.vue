<template>
  <template v-if='user'>
    <user-button></user-button>
  </template>
</template>

<script>
import store, { getters } from './store';
import UserButton from './UserButton.vue';

export default {
  components: {
    UserButton,
  },
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
    getters,
    actions: {
      setUser({ dispatch }, user) {
        dispatch('SET_USER', user);
      }
    },
  }
};
</script>

<style>
</style>
