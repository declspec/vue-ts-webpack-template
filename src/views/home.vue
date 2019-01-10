<template>
    <div>
        <router-link to="/test">Go to test page</router-link>
        <todo-list :todos="todos"></todo-list>

        <h2>Second List</h2>
        <ul>
            <li>One</li>
            <li>Two</li>
            <li>Three</li>
        </ul>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import component from 'vue-class-component';
    
    import TodoList from '../components/todo-list.vue';

    import { inject } from 'vue-inversify';
    import { IHttp } from '../services/http';

    @component({
        components: {
            TodoList
        }
    })
    export default class HomeView extends Vue {
        @inject('IHttp')
        private _http: IHttp;
        
        beforeCreate() {
            console.log(this._http);
        }

        todos: any[] = [];

        mounted() {
            this._http.get('https://jsonplaceholder.typicode.com/comments').then(res => {
                this.todos = res.body;
            });
        }
    }
</script>