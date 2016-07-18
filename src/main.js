import Vue from 'vue';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import App from './components/App';
import Archive from './components/Archive';
import List from './components/List';
import Login from './components/Login';

Vue.use(VueResource);
Vue.use(VueRouter);

const Main = Vue.extend({});
const router = new VueRouter({ history: true });

router.map({
  '/': {
    component: App,
    subRoutes: {
      '/list/:owner/:slug': { name: 'list', component: List },
      '/archive/:owner/:slug': { name: 'archive', component: Archive },
    },
  },
  '/login': { component: Login },
});

router.start(Main, 'body');
