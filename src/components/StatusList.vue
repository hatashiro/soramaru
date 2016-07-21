<template>
  <div v-if='recentStatuses.length > 0' class='recent' @click='showRecent'>
    View {{ recentStatuses.length }} new status<span v-if='recentStatuses.length > 1'>es</span>
  </div>
  <div v-if='error' class='error'>{{ error }}</div>
  <div v-else class='statuses'>
    <status v-for='status in statuses' :status='status' track-by='idStr'></status>
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
  props: {
    uri: String,
    isList: { type: Boolean, default: false },
  },
  components: { Status },
  data() {
    return {
      recentStatuses: [],
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
    if (this.isList) {
      if (this.loadRecentInterval) {
        clearInterval(this.loadRecentInterval);
      }
      this.loadRecentInterval = setInterval(() => this.loadRecent(), 20000);
    }
  },
  beforeDestroy() {
    this.disableInfiniteScroll();
    if (this.loadRecentInterval) {
      clearInterval(this.loadRecentInterval);
    }
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
        this.loading = false;
        throw res;
      }
      const data = res.json();
      this.from = data.from;
      this.statuses = this.statuses.concat(data.statuses);

      this.afterLoaded(data);
    },
    async loadRecent() {
      const res = await this.$http.get(this.uri, { params: { from: this.to } });
      const data = res.json();
      if (data.total === 0) {
        return;
      }
      this.to = data.to;
      if (data.filtered === 0) {
        return;
      }
      this.recentStatuses = data.statuses.concat(this.recentStatuses);
    },
    showRecent() {
      this.statuses = this.recentStatuses.concat(this.statuses);
      this.recentStatuses = [];
    },
  },
};
</script>

<style scoped>
.statuses {
  max-width: 400px;
  overflow-x: hidden;
  margin: 0 auto;
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
.recent {
  cursor: pointer;
  text-align: center;
  font-size: 13px;
  color: #999;
  padding: 10px 0;
}
</style>
