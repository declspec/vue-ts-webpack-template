<template>
    <div>
        <h2>Todos ({{ todos. }})</h2>
        <ul>
            <li v-for="todo in todos" :key="todo.id">
                <nav-link :url="`https://jsonplaceholder.typicode.com/comments/${todo.id}`">{{ todo.name }}</nav-link>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Link from './link.vue';

    export default Vue.extend({
        props: [ 'todos' ]
    });
</script>

<style lang="scss" scoped>
    ul {
        li:nth-child(even) {
            a { color: red; }
        }
    }
</style>
