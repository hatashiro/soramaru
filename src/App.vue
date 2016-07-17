<template>
</template>

<script>
export default {
  data() {
    return {
      login: null,
    };
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
    this.login = this.json();
  },
};
</script>

<style>
</style>
