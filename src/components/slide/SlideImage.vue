<script lang="ts" setup>
import { computed, inject } from 'vue'
import { motion } from 'motion-v'
import { QuestionEntry } from '@/lib/store/db'

const props = defineProps<{
  id: string
  isAnswerShown: boolean
  image: QuestionEntry['image']
  backgroundColor: QuestionEntry['backgroundColor']
  flipped: QuestionEntry['imageFlipped']
  obscurred: QuestionEntry['imageObscurred']
}>()

const isAnimated = inject<boolean>('isAnimated')
const imageSrc = computed(() => (props.image ? URL.createObjectURL(props.image) : undefined))
</script>

<template>
  <motion.div
    :key="id"
    class="imageContainer"
    :initial="
      isAnimated
        ? {
            opacity: 0,
            scale: 1.1,
            rotateY: flipped ? 180 : 0,
          }
        : false
    "
    :animate="{ opacity: 1, scale: 1 }"
    :exit="{
      opacity: 0,
      transition: { delay: 0, duration: isAnimated ? 0.5 : 0 },
    }"
    :transition="{ delay: 0.25, duration: 1 }"
  >
    <img
      v-if="imageSrc"
      :src="imageSrc"
      alt=""
      class="slideImage"
      :class="{ '-obscured': !isAnswerShown && obscurred, '-flipped': flipped }"
    />
    <div v-else class="slideBlockColor" />
  </motion.div>
</template>

<style lang="scss" scoped>
.imageContainer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.slideImage {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 1s ease;
  will-change: opacity, transform, filter;

  &.-flipped {
    transform: rotateY(180deg);
  }

  &.-obscured {
    filter: blur(30px) hue-rotate(-40deg);
    opacity: 0.8;
    transform: scale(1.2);
  }
}

.slideBlockColor {
  width: 100%;
  height: 100%;
  background-color: v-bind('backgroundColor');
}
</style>
