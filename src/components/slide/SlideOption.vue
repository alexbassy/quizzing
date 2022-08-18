<script lang="ts" setup>
import { computed, inject } from 'vue'
import { Motion } from 'motion/vue'
import { OPTION } from '@/lib/motion-variants'

const props = defineProps<{
  option: string
  index: number
  isAnswerShown: boolean
  isCorrect: boolean
}>()

const isAnimated = inject<boolean>('isAnimated')

const slideInitial = computed(() => (isAnimated ? OPTION.initial : false))
const slideShown = computed(() => OPTION.shown)
const slideHidden = OPTION.hidden
</script>

<template>
  <Motion
    tag="li"
    class="slideOptionContainer"
    :initial="slideInitial"
    :animate="slideShown"
    :exit="slideHidden"
    :transition="{ type: 'spring', duration: isAnimated ? 1 : 0, delay: 1 + index * 0.15 }"
  >
    <span class="option" :class="{ '-answerShown': isAnswerShown, '-correct': isCorrect }">
      {{ option }}
    </span>
  </Motion>
</template>

<style lang="scss" scoped>
.slideOptionContainer {
  margin: 1.4rem 0;
  counter-increment: option-counter;
  font-size: var(--slide-option-font-size);
  transform-origin: left;
}

.option {
  display: flex;
  align-items: center;
  transform-origin: left;
  transition: 0.25s ease;
  transition-property: opacity, transform, text-shadow;

  &::before {
    display: flex;
    width: var(--slide-option-counter-size);
    height: var(--slide-option-counter-size);
    flex-shrink: 0;
    align-self: flex-start;
    margin-right: 1rem;
    background: #ffffff21;
    border-radius: 5px;
    content: counter(option-counter, upper-alpha);
    font-size: var(--slide-option-counter-font-size);
    place-content: center;
    place-items: center;
    text-align: center;
    transition: 0.25s ease;
    transition-property: color, background-color, box-shadow;
    will-change: color, background-color;
  }

  &.-answerShown.-correct {
    &::before {
      background-color: #28bb2e;
      box-shadow: 0 0 20px #28bb2e85, 0 0 60px #28bb2e50;
      color: #ffffff;
    }
  }

  &.-answerShown {
    opacity: 0.2;
    text-shadow: 0 0 30px rgb(0 0 0 / 100%);

    &.-correct {
      opacity: 1;
    }
  }
}
</style>
