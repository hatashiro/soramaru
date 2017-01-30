<template>
  <div class='photo' @click="openPhoto">
    <img class='default' :src='photo.default'>
  </div>
</template>

<script>
export default {
  props: ['photo'],
  methods: {
    openPhoto() {
      window.open(this.photo.large);
    }
  }
};
</script>

<style scoped>
.photo {
  display: block;
  border-bottom: 1px solid #e1e8ed;
  cursor: pointer;
}

img.default {
  width: 100%;
  display: block;
}
</style>
