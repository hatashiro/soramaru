<template>
  <template v-if='user'>
    <main id='main' :class="{ 'menu-open': menuOpen }">
      <router-view></router-view>
    </main>
    <div class='main-wrapper' v-if='menuOpen' @click='toggleMenu' transition='fade-in'></div>
    <user-button></user-button>
    <right-menu></right-menu>
  </template>
</template>

<script>
import store from '../store';
import UserButton from './UserButton.vue';
import RightMenu from './RightMenu.vue';
import { user, menuOpen } from '../vuex/getters';
import { setUser, toggleMenu, closeMenu } from '../vuex/actions';

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
    actions: { setUser, toggleMenu, closeMenu },
  },
  route: {
    data() {
      this.closeMenu();
    },
  },
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
  color: #444;
  background-color: #f5f8fa;
}

a, a:visited {
  color: #0074D9;
}

#main {
  position: relative;
  z-index: 1;
  transition: transform .3s ease-in-out;
  background-color: #f5f8fa;
  min-height: 100%;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  padding: 10px;

  &.menu-open {
    transform: translateX(-256px);
    overflow: hidden;
  }
}

.main-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  z-index: 3;

  &.fade-in-transition {
    transition: transform .3s ease-in-out, opacity .3s ease-in-out;
    opacity: 0.4;
    transform: translateX(-256px);
  }
  &.fade-in-enter, &.fade-in-leave {
    opacity: 0;
    transform: translateX(0);
  }
}
</style>
