<template>
  <status-list :uri='uri'></status-list>
</template>

<script>
import StatusList from './StatusList.vue';

export default {
  components: { StatusList },
  computed: {
    uri() {
      const list = `${this.$route.params.owner}/${this.$route.params.slug}`;
      return `/archives/${list}`;
    }
  },
};
</script>
