<script lang="ts" setup>
import { computed, defineProps, provide } from 'vue'
import { Motion, Presence } from 'motion/vue'
import { IQuestion } from '@/lib/questions'
import SlideImage from './SlideImage.vue'
import { FADE, SLIDE } from '@/lib/motion-variants'
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
const slideShown = computed(() => (props.isPhotoShown ? SLIDE.initial : SLIDE.shown))
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
  width: 70vw;
  height: 100vh;
  background: linear-gradient(
    90deg,
    rgb(0 0 0 / 0.8) 30%,
    rgb(0 0 0 / 0.6) 70%,
    rgb(0 0 0 / 0) 100%
  );
  padding: 0 10vw 0 5vw;
}

.title {
  font-size: 4vw;
  margin: 0.5em 0;
  font-weight: 800;
}

.count {
  font-size: 1.5vw;
  font-weight: 600;
  color: #ffffff80;
  margin: auto 0 0;
}

.options {
  list-style: none;
  padding: 0;
  counter-reset: option-counter;
  margin-bottom: auto;
}
</style>
