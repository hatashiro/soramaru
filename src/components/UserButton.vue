<template>
  <div class='user-button'>
    <img :src='user.thumbnail'>
  </div>
</template>

<script>
import { getters } from '../store';

export default {
  vuex: {
    getters,
  }
};
</script>

<style scoped>
.user-button {
  width: 30px;
  height: 30px;
  position: fixed;
  top: 5px;
  right: 5px;
  border-radius: 15px;
  overflow: hidden;
  border: 1px solid #ddd;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>
