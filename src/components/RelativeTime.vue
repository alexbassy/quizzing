<script lang="ts" setup>
import { computed } from 'vue'
import { formatRelativeTime, humanReadableTime } from '@/lib/time'

const props = defineProps<{ time: Date | number | string }>()

const humanReadable = computed(() => humanReadableTime(props.time))
</script>

<template>
  <time :title="humanReadable">{{ formatRelativeTime(time) }}</time>
</template>
