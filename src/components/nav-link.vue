<template>
    <a :href="url" target="_blank" rel="noopener"><slot>{{ url }}</slot></a>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    props: [ 'url' ]
})
</script>
