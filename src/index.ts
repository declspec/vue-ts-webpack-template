import Vue from 'vue';
import VueRouter from 'vue-router';
import VueInversify from 'vue-inversify';

import Routes from './config/routes';
import Container from './config/container';
import RegisterComponents from './config/global-components';

import Layout from './layout.vue';

Vue.use(VueRouter);
Vue.use(VueInversify, { container: Container });
Vue.use(RegisterComponents, {});

const vm = new Vue({
    el: '#app',
    render: r => r(Layout),
    router: new VueRouter({
        routes: Routes
    }),
});