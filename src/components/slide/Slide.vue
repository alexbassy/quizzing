<script lang="ts" setup>
import { defineProps, provide, watchEffect } from 'vue'
import { IQuestion } from '@/lib/questions'
import SlideImage from './SlideImage.vue'

const props = defineProps<{
  isAnswerShown?: boolean
  isPhotoShown?: boolean
  isEditing?: boolean
  isAnimated?: boolean
  question: IQuestion
}>()

provide('isAnimated', props.isAnimated)

watchEffect(() => console.log(props.question))

console.log(props)
</script>

<template>
  <SlideImage :image="question.image" :is-answer-shown="false" />
</template>

<style lang="scss" scoped>
.Slide {
}
</style>
