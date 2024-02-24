<script lang="ts" setup>
import { QuestionEntry, QuestionType } from '@/lib/store/db'
import RubbishIcon from '../icons/RubbishIcon.vue'

const props = defineProps<{
  question: QuestionEntry
  isActive: boolean
  index: number
  draggedOver: boolean
}>()

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
    :class="{
      '-active': isActive,
      '-draggedOver': draggedOver,
      '-category': question.type === QuestionType.Category,
    }"
    :style="`--background-color: ${question.backgroundColor || 'gray'};`"
    tabindex="0"
    role="button"
    draggable="true"
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
      draggable="false"
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
  width: 100%;
  align-items: center;
  margin-bottom: 1.5rem;
  aspect-ratio: 4 / 3;
  background: var(--background-color);
  border-radius: 8px;
  cursor: pointer;
  transition: 0.25s ease;
  transition-property: transform, background-color, box-shadow;

  &.-draggedOver {
    &::before {
      position: absolute;
      z-index: 1;
      top: calc(-0.75rem - 1px);
      left: 5%;
      width: 90%;
      height: 2px;
      background-color: #ef476f;
      border-radius: 4px;
      content: '';
    }
  }

  &:focus-visible {
    box-shadow: 0 0 0 0.25rem blue;
  }

  &.-active {
    box-shadow: 0 0 0 0.5rem #ffffff20;
  }

  &.-category {
    aspect-ratio: 3 / 1;
    opacity: 0.75;
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
    user-select: none;
  }

  &__cover {
    position: absolute;
    z-index: 0;
    width: 100%;
    height: 100%;
    border-radius: 8px;
    filter: brightness(0.5);
    object-fit: cover;
    user-select: none;
  }
}
</style>
