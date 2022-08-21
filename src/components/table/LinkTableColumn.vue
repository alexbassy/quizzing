<script lang="ts">
export default { name: 'LinkTableColumn' }
</script>

<script lang="ts" setup>
defineProps<{ title: string }>()
</script>

<template>
  <slot />
</template>
