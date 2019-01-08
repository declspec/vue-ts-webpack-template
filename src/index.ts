import Vue from 'vue';
import VueRouter from 'vue-router';

import Routes from './config/routes';

import Layout from './layout.vue';

Vue.use(VueRouter);

const vm = new Vue({
    el: '#app',
    render: r => r(Layout),
    router: new VueRouter({
        routes: Routes
    }),
});