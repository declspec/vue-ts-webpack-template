import Vue from 'vue';
import VueRouter from 'vue-router';
import VueInversify from 'vue-inversify';

import Routes from './config/routes';
import Container from './config/container';

import Layout from './layout.vue';

Vue.use(VueRouter);
Vue.use(VueInversify, { container: Container });

const vm = new Vue({
    el: '#app',
    render: r => r(Layout),
    router: new VueRouter({
        routes: Routes
    }),
});