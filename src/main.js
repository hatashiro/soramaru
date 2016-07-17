import Vue from 'vue';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import App from './App';

Vue.use(VueResource);
Vue.use(VueRouter);

const Main = Vue.extend({});
const router = new VueRouter({ history: true });

router.map({
  '/': { component: App },
});

router.start(Main, 'body');
