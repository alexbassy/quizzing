<script lang="ts">
export default { name: 'LinkTableColumn' }
</script>

<script lang="ts" setup>
import { defineProps } from 'vue'
defineProps<{ title: string }>()
</script>

<template>
  <slot />
</template>
