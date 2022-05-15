<script lang="ts" setup>
import { computed, defineProps, inject } from 'vue'
import { Motion } from 'motion/vue'
import { SLIDE } from '@/lib/motion-variants'
import { IQuestionOption } from '@/lib/questions'

const props = defineProps<{
  isAnswerShown: boolean
  option: IQuestionOption
  index: number
}>()

const isAnimated = inject<boolean>('isAnimated')

const slideInitial = computed(() => (isAnimated ? SLIDE.initial : false))
const slideShown = computed(() => SLIDE.shown)
const slideHidden = SLIDE.hidden
</script>

<template>
  <Motion
    tag="li"
    class="container"
    :initial="slideInitial"
    :animate="slideShown"
    :exit="slideHidden"
    :transition="{ type: 'spring', duration: isAnimated ? 1 : 0, delay: 1 + index * 0.2 }"
  >
    <span class="option" :class="{ '-answerShown': isAnswerShown, '-correct': option.correct }">
      {{ option.text }}
    </span>
  </Motion>
</template>

<style lang="scss" scoped>
.container {
  font-size: 1.75vw;
  margin: 1.4rem 0;
  transform-origin: left;
  counter-increment: option-counter;
}

.option {
  display: flex;
  align-items: center;
  transition: 0.25s ease;
  transition-property: opacity, transform, text-shadow;
  transform-origin: left;

  &::before {
    content: counter(option-counter, upper-alpha);
    margin-right: 1rem;
    background: #ffffff21;
    align-self: flex-start;
    display: flex;
    flex-shrink: 0;
    font-size: 2vw;
    width: 1.5em;
    height: 1.5em;
    text-align: center;
    place-content: center;
    place-items: center;
    border-radius: 5px;
    transition: 0.25s ease;
    transition-property: color, background-color, box-shadow;
    will-change: color, background-color;
  }

  &.-answerShown.-correct {
    &::before {
      color: #ffffff;
      background-color: #28bb2e;
      box-shadow: 0 0 20px #28bb2e85, 0 0 60px #28bb2e50;
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
