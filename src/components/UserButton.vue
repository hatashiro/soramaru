<template>
  <div class='user-button' @click='toggleMenu' :class="{ 'menu-open': menuOpen }">
    <img :src='user.thumbnail'>
  </div>
</template>

<script>
import { user, menuOpen } from '../vuex/getters';
import { toggleMenu } from '../vuex/actions';

export default {
  vuex: {
    getters: { user, menuOpen },
    actions: { toggleMenu },
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
  transition: transform .3s ease-in-out;
  z-index: 2;

  &.menu-open {
    transform: translateX(-256px);
  }

  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>
