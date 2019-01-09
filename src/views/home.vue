<template>
    <div>
        <h4>{{ greeting }}, {{ _greetingService }}</h4>
        <router-link to="/test">Go to test page</router-link>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import component from 'vue-class-component';
    import { inject } from 'vue-inversify';
    import { IGreetingService } from '../index';

    @component
    export default class HomeView extends Vue {
        @inject('IGreetingService')
        private _greetingService: IGreetingService | string;

        greeting: string = 'Temp';

        mounted() {
            this.greeting = typeof(this._greetingService) === 'string' ? this._greetingService : this._greetingService.getGreeting();

            setTimeout(() => {
                this._greetingService = 'bar';
            }, 1000);
        }
    }
</script>