import Vue from 'vue';
import VueRouter from 'vue-router';
import { Container, injectable } from 'inversify';
import VueInversify from 'vue-inversify';

import Routes from './config/routes';

import Layout from './layout.vue';

export interface IGreetingService {
    getGreeting() : string
}

@injectable()
export class GreetingService implements IGreetingService {
    getGreeting() {
        return 'Hello, world!';
    }
};

const container = new Container();

container.bind<IGreetingService>('IGreetingService').to(GreetingService);

Vue.use(VueRouter);
Vue.use(VueInversify, { container });

const vm = new Vue({
    el: '#app',
    render: r => r(Layout),
    router: new VueRouter({
        routes: Routes
    }),
});