<script lang="ts" setup>
import { FADE, SLIDE } from '@/lib/motion-variants'
import { IQuestion } from '@/lib/questions'
import { Motion, Presence } from 'motion/vue'
import { computed, defineProps, provide } from 'vue'
import SlideImage from './SlideImage.vue'
import SlideOption from './SlideOption.vue'

const props = defineProps<{
  isAnswerShown: boolean
  isPhotoShown?: boolean
  isEditing?: boolean
  isAnimated?: boolean
  question: IQuestion
}>()

provide('isAnimated', props.isAnimated)

const fadeInitial = computed(() => (props.isAnimated ? FADE.initial : false))
const fadeShown = computed(() => (props.isPhotoShown ? FADE.initial : FADE.shown))
const fadeHidden = FADE.hidden

const slideInitial = computed(() => (props.isAnimated ? SLIDE.initial : false))
const slideShown = computed(() => SLIDE.shown)
const slideHidden = SLIDE.hidden
</script>

<template>
  <SlideImage :image="question.image" :is-answer-shown="false" />
  <!-- Gradient background -->
  <Motion class="text-content" :initial="fadeInitial" :animate="fadeShown" :exit="fadeHidden">
    <!-- Count -->
    <Motion
      tag="span"
      class="count"
      :key="'count ' + question.count"
      :initial="slideInitial"
      :animate="slideShown"
      :exit="slideHidden"
      :transition="{ duration: isAnimated ? 1 : 0 }"
      >{{ question.count }}</Motion
    >

    <!-- Title -->
    <Motion
      tag="h2"
      class="title"
      :key="'title ' + question.id"
      :initial="slideInitial"
      :animate="slideShown"
      :exit="slideHidden"
      :transition="{ duration: isAnimated ? 1 : 0, delay: 0.2 }"
      >{{ question.title }}</Motion
    >

    <!-- Options list -->
    <Motion tag="ol" class="options" :key="'options ' + question.id">
      <Presence v-for="(option, i) in question.options">
        <SlideOption
          :key="option.id"
          :option="option"
          :is-answer-shown="isAnswerShown"
          :index="i"
        />
      </Presence>
    </Motion>
  </Motion>
</template>

<style lang="scss" scoped>
.text-content {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #fff;
  z-index: 2;
  width: var(--slide-content-width);
  height: 100vh;
  background: var(--slide-content-gradient);
  padding: 0 var(--slide-content-padding-right) 0 var(--slide-content-padding-left);
}

.title {
  font-size: var(--slide-title-font-size);
  margin: 0.5em 0;
  font-weight: 800;
  word-break: break-word;
}

.count {
  font-size: var(--slide-count-font-size);
  padding-left: 2rem;
  font-weight: 600;
  color: #ffffff80;
  margin: auto 0 0;
}

.options {
  list-style: none;
  padding: 0 0 0 2rem;
  counter-reset: option-counter;
  margin-bottom: auto;
}
</style>
