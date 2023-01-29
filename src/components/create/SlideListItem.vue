<script lang="ts" setup>
import { QuestionEntry } from '@/lib/store/db'
import RubbishIcon from '../icons/RubbishIcon.vue'

const props = defineProps<{ question: QuestionEntry; isActive: boolean; index: number }>()

const emit = defineEmits(['set-active', 'delete'])

function setActive() {
  emit('set-active', props.question.id!)
}

function deleteQuestion() {
  emit('delete', props.question.id!)
}

function getImageObjectURL(question: QuestionEntry) {
  const blob = question.thumbnailImage || question.image
  return blob ? URL.createObjectURL(blob) : ''
}
</script>

<template>
  <li
    class="slideListItem"
    :class="{ '-active': isActive }"
    :style="`--background-color: ${question.backgroundColor || 'gray'};`"
    tabindex="0"
    role="button"
    @click="setActive"
    @keyup.enter="setActive"
    @keyup.space.prevent="setActive"
  >
    <img
      v-if="question.image"
      class="slideListItem__cover"
      :src="getImageObjectURL(question)"
      :alt="question.title"
      loading="lazy"
    />
    <button
      class="slideListItem__deleteButton"
      :aria-label="`Delete question ${index}`"
      :tabindex="isActive ? 0 : -1"
      @click.stop="deleteQuestion"
    >
      <RubbishIcon />
    </button>
    <div class="slideListItem__title">{{ question.title }}</div>
  </li>
</template>

<style lang="scss" scoped>
.slideListItem {
  position: relative;
  display: flex;
  overflow: hidden;
  width: 100%;
  align-items: center;
  margin-bottom: 1.5rem;
  aspect-ratio: 4 / 3;
  background: var(--background-color);
  border-radius: 8px;
  cursor: pointer;
  transition: 0.25s ease;
  transition-property: transform, background-color, box-shadow;

  &:focus-visible {
    box-shadow: 0 0 0 0.25rem blue;
  }

  &.-active {
    box-shadow: 0 0 0 0.5rem #ffffff20;
  }

  &__deleteButton {
    --background-alpha: 0%;
    --foreground-alpha: 0%;

    position: absolute;
    z-index: 2;
    top: 0.5rem;
    right: 0.5rem;
    display: flex;
    width: 1.85rem;
    height: 1.85rem;
    align-items: center;
    justify-content: center;
    background-color: rgb(0 0 0 / var(--background-alpha));
    border-radius: 5px;
    color: rgb(255 255 255 / var(--foreground-alpha));
    cursor: pointer;
    transition: 0.25s ease;
    transition-property: color, background-color, transform;

    .slideListItem:hover &,
    .slideListItem.-active & {
      --background-alpha: 10%;
      --foreground-alpha: 30%;

      &:hover {
        --background-alpha: 20%;
        --foreground-alpha: 70%;
      }

      &:active {
        --background-alpha: 10%;
        --foreground-alpha: 30%;
        transform: scale(0.95);
      }
    }
  }

  &__title {
    position: relative;
    z-index: 2;
    margin: 1vw;
    font-size: 1.1vw;
    font-weight: bold;
    text-shadow: 0 1px 10px rgba(0 0 0 / 50%);
  }

  &__cover {
    position: absolute;
    z-index: 0;
    width: 100%;
    height: 100%;
    filter: brightness(0.5);
    object-fit: cover;
  }
}
</style>
