import Vue from 'vue';

import NavLink from '../components/nav-link.vue';

export default function (vue: Vue.VueConstructor<Vue>, options?: {}) {
    vue.component('navLink', NavLink);
}