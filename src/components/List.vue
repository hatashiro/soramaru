<template>
  <status-list :uri='uri' is-list></status-list>
</template>

<script>
import StatusList from './StatusList.vue';

export default {
  components: { StatusList },
  computed: {
    uri() {
      const list = `${this.$route.params.owner}/${this.$route.params.slug}`;
      return `/twitter/lists/${list}`;
    }
  },
};
</script>
