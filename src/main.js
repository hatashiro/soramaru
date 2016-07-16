import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App';

Vue.use(VueRouter);

const Main = Vue.extend({});
const router = new VueRouter();

router.map({
  '/': { component: App },
});

router.start(Main, 'body');
