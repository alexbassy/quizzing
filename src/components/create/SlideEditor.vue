<script lang="ts" setup>
import { IQuestion } from '@/lib/questions'
import { defineProps } from 'vue'
import Slide from '../slide'

const props = defineProps<{ question: IQuestion }>()
</script>

<template>
  <div class="container">
    <Slide :question="question" is-answer-shown />
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
