<template>
  <div v-if='error' class='error'>{{ error }}</div>
  <div v-else class='statuses'>
    <status v-for='status in statuses' :status='status' track-by='$index'></status>
  </div>
  <div v-if='loading' class='loading'>
    <div class="spinner">
      <div class="bounce1"></div>
      <div class="bounce2"></div>
      <div class="bounce3"></div>
    </div>
  </div>
</template>

<script>
import Status from './Status.vue';
import InfiniteScrollMixin from '../mixins/infinite-scroll';

export default {
  mixins: [InfiniteScrollMixin],
  props: ['uri'],
  components: { Status },
  data() {
    return {
      statuses: [],
      from: null,
      to: null,
      error: null,
      loading: false,
      noMore: false,
    };
  },
  created() {
    this.loadStatuses(this.uri);
    this.initInfiniteScroll(() => {
      if (this.loading || this.noMore) {
        return;
      }
      this.loadMoreStatuses();
    });
  },
  beforeDestroy() {
    this.disableInfiniteScroll();
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
      this.noMore = false;
    },
    afterLoaded(data) {
      this.loading = false;
      if (data.total === 0) {
        this.noMore = true;
      } else if (data.filtered === 0) {
        this.loadMoreStatuses();
      }
    },
    async loadStatuses(uri) {
      this.loading = true;
      this.reset();

      let res;
      try {
        res = await this.$http.get(uri);
      } catch (res) {
        if (res.status === 404) {
          this.error = res.body;
          return;
        }
        throw res;
      }

      const data = res.json();
      this.from = data.from;
      this.to = data.to;
      this.statuses = data.statuses;

      this.afterLoaded(data);
    },
    async loadMoreStatuses() {
      this.loading = true;

      let res;
      try {
        res = await this.$http.get(this.uri, { params: { to: this.from } });
      } catch (res) {
        if (res.status === 404) {
          this.error = res.body;
          return;
        }
        throw res;
      }

      const data = res.json();
      this.from = data.from;
      this.statuses = this.statuses.concat(data.statuses);
      this.afterLoaded(data);
    },
  },
};
</script>

<style scoped>
.statuses {
  overflow-x: hidden;
}
.loading {
  .spinner {
    margin: 7px auto;
    width: 70px;
    text-align: center;
  }
  .spinner > div {
    width: 18px;
    height: 18px;
    background-color: #999;

    border-radius: 100%;
    display: inline-block;
    animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  }
  .spinner .bounce1 {
    animation-delay: -0.32s;
  }
  .spinner .bounce2 {
    animation-delay: -0.16s;
  }
}
@keyframes sk-bouncedelay {
  0%, 80%, 100% {
    transform: scale(0);
  } 40% {
    transform: scale(1.0);
  }
}
</style>
