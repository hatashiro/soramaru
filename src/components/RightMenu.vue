<template>
  <div id='menu' class='menu'>
    <div class='section'>
      <h3>Lists</h3>
      <ul v-if='lists.length > 0'>
        <li v-for='list in lists'>
          <a v-link="listLink(list)" @click='closeMenu'>{{ list.owner }}/{{ list.slug }}</a>
        </li>
      </ul>
      <ul v-else><li>none</li></ul>
      <form @submit.prevent='goToList'>
        <input type='text' v-model='listName' placeholder='... or input manually'>
      </form>
    </div>
    <div class='section'>
      <h3>Archives</h3>
      <ul v-if='archives.length > 0'>
        <li v-for='archive in archives'>
          <a v-link="archiveLink(archive)" @click='closeMenu'>{{ archive }}</a>
        </li>
      </ul>
      <ul v-else><li>none</li></ul>
    </div>
    <div class='section'>
      <button id='logout' @click='logout'>logout</button>
    </div>
  </div>
</template>

<script>
import { lists, archives } from '../vuex/getters';
import { logout, loadLists, loadArchives, closeMenu } from '../vuex/actions';

export default {
  data() {
    return { listName: '' };
  },
  async created() {
    this.loadLists();
    this.loadArchives();
  },
  methods: {
    listLink(list) {
      return {
        name: 'list',
        params: {
          owner: list.owner,
          slug: list.slug,
        },
      };
    },
    archiveLink(archive) {
      const tokens = archive.split('/');
      return {
        name: 'archive',
        params: {
          owner: tokens[0],
          slug: tokens[1],
        },
      };
    },
    goToList() {
      const tokens = this.listName.split('/');
      if (tokens.length !== 2) {
        return;
      }

      this.$router.go({
        name: 'list',
        params: {
          owner: tokens[0],
          slug: tokens[1],
        },
      });
      this.listName = '';
      this.closeMenu();
    },
  },
  vuex: {
    getters: { lists, archives },
    actions: { logout, loadLists, loadArchives, closeMenu },
  },
};
</script>

<style scoped>
.menu {
  position: fixed;
  width: 256px;
  top: 0;
  right: 0;
  height: 100%;
  background-color: #f4f4f4;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
  padding: 20px 35px;

  .section {
    margin: 30px 0;

    h3 {
      margin: 0;
      text-transform: uppercase;
      font-weight: 300;
      color: #666;
      font-size: 13px;
    }

    ul {
      margin: 10px 0;
      padding: 0;
      list-style-type: none;

      li {
        margin: 3px 0;

        a {
          text-decoration: none;
        }
      }
    }

    input {
      height: 18px;
      font-size: 13px;
    }
  }
}

#logout {
  cursor: pointer;
  color: #0074D9;
  text-transform: uppercase;
  font-size: 13px;
  margin: 0;
  padding: 0;
  border: none;
  background: none;
}
</style>
