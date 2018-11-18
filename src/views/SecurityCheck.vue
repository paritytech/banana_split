<template>
    <ul id="security-checklist">
       <ChecklistItem v-bind:checked="true">Serve from local filesystem</ChecklistItem> 
       <ChecklistItem v-bind:checked="false">Go offline</ChecklistItem> 
    </ul>
</template>

<script>
import ChecklistItem from '@/components/ChecklistItem.vue';
export default {
    name: 'SecurityCheck',
    components: {
        ChecklistItem
    }
}
</script>

<style>
#security-checklist > li {
    list-style-type: none;
}
</style>


