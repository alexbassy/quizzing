<script lang="ts" setup>
import { computed, inject } from 'vue'
import { IQuestionImage } from '@/lib/questions'
import { Motion, Presence } from 'motion/vue'

const props = defineProps<{ isAnswerShown: boolean; image: IQuestionImage }>()
const isAnimated = inject<boolean>('isAnimated')
const imageURL = computed(() => `/slide-images/${props.image.url}`)
</script>

<template>
  <Presence exit-before-enter>
    <Motion
      class="imageContainer"
      :key="imageURL"
      :initial="
        isAnimated
          ? {
              opacity: 0,
              scale: 1.1,
              rotateY: image.flip ? 180 : 0,
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
        :src="imageURL"
        alt=""
        class="slideImage"
        :class="{ '-obscured': !isAnswerShown && image.obscured, '-flipped': image.flip }"
      />
    </Motion>
  </Presence>
</template>

<style lang="scss" scoped>
.imageContainer {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.slideImage {
  width: 100%;
  height: 100%;
  transition: all 1s ease;
  object-fit: cover;
  will-change: opacity, transform, filter;

  &.-flipped {
    transform: rotateY(180deg);
  }

  &.-obscured {
    opacity: 0.8;
    transform: scale(1.2);
    filter: blur(30px) hue-rotate(-40deg);
  }
}
</style>
