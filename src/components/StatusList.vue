<template>
  <div v-if='error' class='error'>{{ error }}</div>
  <div v-else class='statuses'>
    <status v-for='status in statuses' :status='status' track-by='idStr'></status>
  </div>
</template>

<script>
import Status from './Status.vue';

export default {
  props: ['uri'],
  components: { Status },
  data() {
    return {
      statuses: [],
      from: null,
      to: null,
      error: null,
    };
  },
  created() {
    this.loadStatuses(this.uri);
  },
  watch: {
    'uri': function (uri) {
      this.loadStatuses(uri);
    },
  },
  methods: {
    reset() {
      this.error = null;
      this.statuses = [];
    },
    async loadStatuses(uri) {
      this.reset();

      let res;
      try {
        res = await this.$http.get(uri);
      } catch (res) {
        if (res.status === 404) {
          this.error = res.body;
          return;
        }
      }

      const data = res.json();
      this.from = data.from;
      this.to = data.to;
      this.statuses = data.statuses;
    },
  },
};
</script>

<style scoped>
.statuses {
  overflow-x: hidden;
}
</style>
