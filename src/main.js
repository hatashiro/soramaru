import Vue from 'vue';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import App from './components/App';
import Index from './components/Index.vue';
import List from './components/List.vue';
import Login from './components/Login.vue';

Vue.use(VueResource);
Vue.use(VueRouter);

const Main = Vue.extend({});
const router = new VueRouter({ history: true });

router.map({
  '/': {
    component: App,
    subRoutes: {
      '/': { component: Index },
      '/list/:owner/:slug': { name: 'list', component: List },
    },
  },
  '/login': { component: Login },
});

router.start(Main, 'body');
