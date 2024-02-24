<script lang="ts" setup>
import { computed, provide } from 'vue'
import { Motion, Presence } from 'motion/vue'
import { FADE, SLIDE } from '@/lib/motion-variants'
import { QuestionEntry, QuestionType } from '@/lib/store/db'
import SlideImage from './SlideImage.vue'
import SlideOption from './SlideOption.vue'

const props = defineProps<{
  isAnswerShown: boolean
  isPhotoShown?: boolean
  isEditing?: boolean
  isAnimated?: boolean
  question: QuestionEntry
  questionIndex?: number
}>()

provide('isAnimated', props.isAnimated)

const isPlayableQuestion = computed(() => props.question.type !== QuestionType.Category)

const fadeInitial = computed(() => (props.isAnimated ? FADE.initial : false))
const fadeShown = computed(() => (props.isPhotoShown ? FADE.initial : FADE.shown))
const fadeHidden = FADE.hidden

const slideInitial = computed(() => (props.isAnimated ? SLIDE.initial : false))
const slideShown = computed(() => SLIDE.shown)
const slideHidden = SLIDE.hidden
</script>

<template>
  <SlideImage
    :id="question.id!"
    :image="question.image"
    :background-color="question.backgroundColor"
    :flipped="question.imageFlipped"
    :obscurred="question.imageObscurred"
    :is-answer-shown="false"
  />

  <!-- Gradient background -->
  <Motion class="text-content" :initial="fadeInitial" :animate="fadeShown" :exit="fadeHidden">
    <!-- Count -->
    <Motion
      v-if="isPlayableQuestion"
      :key="'count ' + questionIndex"
      tag="span"
      class="count"
      :initial="slideInitial"
      :animate="slideShown"
      :exit="slideHidden"
      :transition="{ duration: isAnimated ? 1 : 0 }"
      >{{ questionIndex }}</Motion
    >

    <!-- Title -->
    <Motion
      :key="'title ' + question.id"
      tag="h2"
      class="title"
      :initial="slideInitial"
      :animate="slideShown"
      :exit="slideHidden"
      :transition="{ duration: isAnimated ? 1 : 0, delay: 0.2 }"
      >{{ question.title }}</Motion
    >

    <!-- Options list -->
    <Motion v-if="isPlayableQuestion" :key="'options ' + question.id" tag="ol" class="options">
      <Presence v-for="(option, i) in question.options" :key="i">
        <SlideOption
          :key="option"
          :option="option"
          :is-answer-shown="isAnswerShown"
          :is-correct="question.correctOption === i"
          :explanation="isAnswerShown && question.correctOption === i ? question.explanation : undefined"
          :index="i"
        />
      </Presence>
    </Motion>
  </Motion>
</template>

<style lang="scss" scoped>
.text-content {
  position: relative;
  z-index: 2;
  display: flex;
  width: var(--slide-content-width);
  height: 100vh;
  flex-direction: column;
  justify-content: center;
  padding: 0 var(--slide-content-padding-right) 0 var(--slide-content-padding-left);
  background: var(--slide-content-gradient);
  color: #fff;
}

.title {
  margin: 0.5em 0;
  font-size: var(--slide-title-font-size);
  font-weight: 800;
  word-break: break-word;
}

.count {
  padding-left: 2rem;
  margin: auto 0 0;
  color: #ffffff80;
  font-size: var(--slide-count-font-size);
  font-weight: 600;
}

.options {
  padding: 0 0 0 2rem;
  margin-bottom: auto;
  counter-reset: option-counter;
  list-style: none;
}
</style>
