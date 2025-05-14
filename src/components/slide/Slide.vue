<script lang="ts" setup>
import { computed, provide } from 'vue'
import { motion } from 'motion-v'
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
  <motion.div class="text-content" :initial="fadeInitial" :animate="fadeShown" :exit="fadeHidden">
    <!-- Count -->
    <motion.span
      v-if="isPlayableQuestion"
      :key="'count ' + questionIndex"
      class="count"
      :initial="slideInitial"
      :animate="slideShown"
      :exit="slideHidden"
      :transition="{ duration: isAnimated ? 1 : 0 }"
      >{{ questionIndex }}</motion.span
    >

    <!-- Title -->
    <motion.h2
      :key="'title ' + question.id"
      class="title"
      :initial="slideInitial"
      :animate="slideShown"
      :exit="slideHidden"
      :transition="{ duration: isAnimated ? 1 : 0, delay: 0.2 }"
      >{{ question.title }}</motion.h2
    >

    <!-- Options list -->
    <motion.ol v-if="isPlayableQuestion" :key="'options ' + question.id" class="options">
      <SlideOption
        v-for="(option, i) in question.options"
        :key="i"
        :option="option"
        :is-answer-shown="isAnswerShown"
        :is-correct="question.correctOption === i"
        :explanation="isAnswerShown && question.correctOption === i ? question.explanation : undefined"
        :index="i"
      />
    </motion.ol>
  </motion.div>
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
