<template>
  <template v-if='user'>
    <main id='main' :class="{ 'menu-open': menuOpen }">
      <router-view></router-view>
      <user-button></user-button>
      <div class='main-wrapper' v-if='menuOpen' @click='toggleMenu' transition='fade-in'></div>
    </main>
    <right-menu></right-menu>
  </template>
</template>

<script>
import store from '../store';
import UserButton from './UserButton.vue';
import RightMenu from './RightMenu.vue';
import { user, menuOpen } from '../vuex/getters';
import { setUser, toggleMenu } from '../vuex/actions';

export default {
  components: {
    UserButton,
    RightMenu,
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
    this.setUser(res.json());
  },
  store,
  vuex: {
    getters: { user, menuOpen },
    actions: { setUser, toggleMenu },
  }
};
</script>

<style>
@import 'https://fonts.googleapis.com/css?family=Roboto';

html {
  height: 100%;
}

body {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}

a, a:visited {
  color: #0074D9;
}

#main {
  position: relative;
  z-index: 1;
  transition: transform .3s ease-in-out;
  background-color: white;
  min-height: 100%;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);

  &.menu-open {
    transform: translateX(-256px);
    overflow: hidden;
  }

  .main-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: white;
    opacity: 0.3;

    &.fade-in-transition {
      transition: opacity .3s ease-in-out;
    }
    &.fade-in-enter, &.fade-in-leave {
      opacity: 0;
    }
  }
}
</style>
