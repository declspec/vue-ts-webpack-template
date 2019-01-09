<template>
    <div>
        <h4>{{ greeting }}</h4>
        <router-link to="/test">Go to test page</router-link>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import component from 'vue-class-component';
    import { inject } from 'vue-inversify';
    import { IHttp } from '../services/http';

    @component
    export default class HomeView extends Vue {
        @inject('IHttp')
        private _http: IHttp;

        greeting: string = 'Temp';

        mounted() {
            this._http.get('https://jsonplaceholder.typicode.com/todos/1').then(res => {
                this.greeting = res.body.title;
            });
        }
    }
</script>