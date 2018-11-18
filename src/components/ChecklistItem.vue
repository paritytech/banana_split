<template>
    <li>
        <span v-if="checked">&#9745;</span>
        <span v-else>&#9744;</span>
        <span v-bind:class="{ checked: checked }"><slot></slot></span>
    </li>
</template>

<script>
export default {
    name: 'ChecklistItem',
    props: {
        checked: Boolean
    }

}
</script>

<style>
.checked {
    text-decoration: line-through;
}
</style>