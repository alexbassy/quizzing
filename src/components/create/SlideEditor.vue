<script lang="ts" setup>
import { QuestionEntry } from '@/lib/store/db'
import { computed, defineProps, ref } from 'vue'

const props = defineProps<{ question: QuestionEntry }>()

const hasImage = ref(false)
const imageSrc = computed(() => props.question.image)

const title = computed(() => props.question.title || 'No title')
</script>

<template>
  <div class="container">
    <div class="slide">
      <img v-if="hasImage" class="image" :src="imageSrc" />
      <div class="content">
        <!-- <span class="count">{{}}</span> -->
        <h2 class="title">{{ title }}</h2>
        <ol>
          <li v-for="option in question.options">{{ option }}</li>
        </ol>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  height: 100%;
  position: relative;
  margin: auto;
  align-self: center;
  justify-self: center;
}

.slide {
  background-color: rgb(50, 0, 97);
  width: 100%;
  height: 100%;
}

.image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.title {
  font-size: var(--slide-title-font-size);
}

.count {
  font-size: var(--slide-count-font-size);
}

.option {
}
</style>
