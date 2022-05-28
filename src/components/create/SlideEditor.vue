<script lang="ts" setup>
import { QuestionEntry } from '@/lib/store/db'
import { computed, defineProps, ref } from 'vue'

const props = defineProps<{ question: QuestionEntry }>()

const hasImage = ref(false)
const imageSrc = computed(() => props.question.image)
</script>

<template>
  <div class="container">
    <div class="slide">
      <img v-if="hasImage" class="slide-image" :src="imageSrc" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  max-height: 100%;
  aspect-ratio: 4/3;
  position: relative;
  margin: auto;
  align-self: center;
  justify-self: center;
}
</style>
