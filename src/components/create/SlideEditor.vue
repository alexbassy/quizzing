<script lang="ts" setup>
import { onMounted$ } from '@/composable/useObservable'
import { watch$ } from '@/lib/observables'
import {
  getQuestion$,
  updateQuestionImage,
  updateQuestionOption,
  updateQuestionTitle,
} from '@/lib/store/client'
import { IUnsplashSearchResult } from '@/worker/types'
import { useObservable, useSubscription } from '@vueuse/rxjs'
import { combineLatest, fromEvent, startWith, switchMap } from 'rxjs'
import * as Stretchy from 'stretchy'
import { computed, nextTick, ref } from 'vue'
import PictureIcon from '../icons/PictureIcon.vue'
import ImagePicker from './ImagePicker.vue'

const props = defineProps<{ questionId: string }>()

const imagePickerOpen = ref(false)

const id$ = watch$(() => props.questionId)
const question = useObservable(id$.pipe(switchMap((id) => getQuestion$(id))))

const hasImage = computed(() => Boolean(question.value?.image))
const imageSrc = computed(() =>
  question.value?.image ? URL.createObjectURL(question.value?.image) : undefined
)

const title = computed(() => question.value?.title || '')

const options = computed(() =>
  Array.from({ length: 4 }).map((_, i) => question.value?.options?.[i] || '')
)

async function handleTitleInput(ev: Event) {
  resizeTitleInput()
  await updateQuestionTitle(question.value?.id!, (ev.target as HTMLTextAreaElement).value)
}

async function handleOptionInput(ev: Event, index: number) {
  Stretchy.resize(ev.target as HTMLTextAreaElement)
  await updateQuestionOption(question.value?.id!, index, (ev.target as HTMLTextAreaElement).value)
}

// Resize question textarea on input and window resize
const slideTitle = ref<HTMLTextAreaElement>()
function resizeTitleInput() {
  Stretchy.resize(slideTitle.value)
}
useSubscription(
  combineLatest([
    watch$(title),
    onMounted$(),
    fromEvent(window, 'resize').pipe(startWith(null)),
  ]).subscribe(() => nextTick(() => resizeTitleInput()))
)

// Handle image selection
async function onImageSelect(image: IUnsplashSearchResult) {
  const [fullImage, thumbnail] = await Promise.all([
    fetch(image.urls.regular).then((res) => res.blob()),
    fetch(image.urls.small).then((res) => res.blob()),
  ])
  await updateQuestionImage(question.value?.id!, fullImage, thumbnail)
}
</script>

<template>
  <div class="container">
    <div class="slide" :style="`--background-color: ${question?.backgroundColor};`">
      <img v-if="hasImage" class="image" :src="imageSrc" />
      <button class="change-background" @click="imagePickerOpen = !imagePickerOpen">
        <PictureIcon /> Change background
      </button>
      <image-picker :is-open="imagePickerOpen" @select="onImageSelect" />
      <div class="content">
        <span class="count">&times;</span>
        <div class="title">
          <textarea
            type="text"
            :value="title"
            placeholder="Question title"
            ref="slideTitle"
            class="title-textarea"
            @input="handleTitleInput"
          />
        </div>
        <ol class="options" ref="slideOptions">
          <li v-for="(option, index) in options" class="options-item">
            <input
              type="text"
              :value="option"
              :placeholder="`Option ${index}`"
              class="option-input"
              @input="handleOptionInput($event, index)"
            />
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  position: relative;
  height: 100%;
  align-self: center;
  margin: auto;
  justify-self: center;
}

.slide {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: var(--background-color);
}

.change-background {
  --background-alpha: 20%;

  position: absolute;
  right: 1rem;
  bottom: 1rem;
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background-color: rgb(0 0 0 / var(--background-alpha));
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9375rem;
  font-weight: 500;
  gap: 0.5rem;
  transition: 0.25s ease;
  transition-property: background-color, transform;

  &:hover {
    --background-alpha: 30%;
  }

  &:active {
    --background-alpha: 40%;
    transform: scale(0.975);
  }
}

.image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content {
  position: relative;
  z-index: 2;
  display: flex;
  width: var(--slide-content-width);
  height: calc(100vh - var(--create-header-height));
  flex-direction: column;
  justify-content: center;
  padding: 0 var(--slide-content-padding-right) 0 var(--slide-content-padding-left);
  background: var(--slide-content-gradient);
  color: #fff;
}

.count {
  padding-left: 2rem;
  margin: auto 0 0;
  color: #ffffff80;
  font-size: var(--slide-count-font-size);
  font-weight: 600;
}

.title {
  display: flex;
  margin: 0.5em 0;
  font-size: var(--slide-title-font-size);
  font-weight: 800;
}

.title-textarea {
  @include textarea-outline;
  height: 1.7em;
  padding: 0.4rem 1rem 0.1rem;
  margin-left: -1rem;
  word-break: break-word;

  &::placeholder {
    color: var(--placeholder-color);
  }
}

.options {
  padding: 0 0 0 2rem;
  margin-bottom: auto;
  counter-reset: option-counter;
  list-style: none;
}

.options-item {
  display: flex;
  align-items: center;
  margin: 1.4rem 0;
  counter-increment: option-counter;
  font-size: var(--slide-option-font-size);
  transform-origin: left;
  transition: 0.25s ease;
  transition-property: opacity, transform, text-shadow;

  &::before {
    display: flex;
    width: var(--slide-option-counter-size);
    height: var(--slide-option-counter-size);
    flex-shrink: 0;
    align-self: flex-start;
    margin-right: 1rem;
    background: #ffffff21;
    border-radius: 5px;
    content: counter(option-counter, upper-alpha);
    font-size: var(--slide-option-counter-font-size);
    place-content: center;
    place-items: center;
    text-align: center;
    transition: 0.25s ease;
    transition-property: color, background-color, box-shadow;
    will-change: color, background-color;
  }

  &.-correct {
    &::before {
      background-color: #28bb2e;
      box-shadow: 0 0 20px #28bb2e85, 0 0 60px #28bb2e50;
      color: #ffffff;
    }
  }
}

.option-input {
  @include textarea-outline;
  padding: 0.18rem 0.5rem;
  margin-left: -0.5rem;
  font-size: var(--slide-option-font-size);

  &::placeholder {
    color: var(--placeholder-color);
  }
}
</style>
