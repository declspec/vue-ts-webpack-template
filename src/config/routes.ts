import HomeView from '../views/home.vue';
import TestView from '../views/test.vue';

import { RouteConfig } from 'vue-router';

const Routes : RouteConfig[] = [
    { path: '/', component: HomeView },
    { path: '/test', component: TestView }
];

export default Routes;