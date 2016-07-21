export default {
  methods: {
    initInfiniteScroll(handler) {
      if (this.infiniteScrollHandler) {
        this.disableInfiniteScroll();
      }

      this.infiniteScrollHandler = () => {
        const bottomOffset = document.body.scrollHeight - document.body.scrollTop - window.innerHeight;
        if (bottomOffset < 10) {
          handler();
        }
      };
      window.addEventListener('scroll', this.infiniteScrollHandler);
    },
    disableInfiniteScroll() {
      window.removeEventListener('scroll', this.infiniteScrollHandler);
    },
  },
};
