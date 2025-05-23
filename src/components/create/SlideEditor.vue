<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useObservable } from '@vueuse/rxjs'
import { switchMap } from 'rxjs'
import { watch$ } from '@/lib/observables'
import {
  getQuestion$,
  updateQuestionCorrectOption,
  updateQuestionExplanation,
  updateQuestionImage,
  updateQuestionOption,
  updateQuestionTitle,
} from '@/lib/store/client'
import { IUnsplashSearchResult } from '@/worker/types'
import PictureIcon from '../icons/PictureIcon.vue'
import SecondaryButton from '../SecondaryButton.vue'
import { QuestionType } from '../../lib/store/db'
import ImagePicker from './ImagePicker.vue'
import Dropzone from './Dropzone.vue'
import { getApiUrl } from '@/lib/env'

const props = defineProps<{ questionId: string; index: number }>()

const imagePickerOpen = ref(false)

const id$ = watch$(() => props.questionId)
const question = useObservable(id$.pipe(switchMap((id) => getQuestion$(id))))

const hasImage = computed(() => Boolean(question.value?.image))
const imageSrc = computed(() =>
  question.value?.image ? URL.createObjectURL(question.value?.image) : undefined
)

const title = computed(() => question.value?.title || '')

const isCategory = computed(() => question.value?.type === QuestionType.Category)

const questionId = computed(() => question.value?.id || '')

const correctOption = computed(() => question.value?.correctOption)

const letterIndex = ['A', 'B', 'C', 'D']

const options = computed(() => Array.from({ length: 4 }).map((_, i) => question.value?.options?.[i] || ''))

const explanation = computed(() => question.value?.explanation || '')

async function handleTitleInput(ev: Event) {
  await updateQuestionTitle(questionId.value, (ev.target as HTMLTextAreaElement).value)
}

async function handleOptionInput(ev: Event, index: number) {
  await updateQuestionOption(questionId.value, index, (ev.target as HTMLTextAreaElement).value)
}

async function handleExplanationInput(ev: Event) {
  await updateQuestionExplanation(questionId.value, (ev.target as HTMLTextAreaElement).value)
}

async function setCorrectOption(index: number) {
  await updateQuestionCorrectOption(questionId.value, index)
}

// When the user selects an image from the image picker, fetch the full image and thumbnail and save it to the database
async function onImageSelect(image: IUnsplashSearchResult) {
  const [fullImage, thumbnail] = await Promise.all([
    fetch(image.urls.regular).then((res) => res.blob()),
    fetch(image.urls.small).then((res) => res.blob()),
  ])
  await updateQuestionImage(question.value?.id!, fullImage, thumbnail)
}

async function onOptimise() {
  const questionImage = question.value?.image
  if (!questionImage) {
    console.warn('No image to optimised; skipping')
    return
  }
  const compressResponse = await fetch(`${getApiUrl()}/compress`, {
    method: 'POST',
    body: questionImage,
  })
  const compressedImage = await compressResponse.json<{ ratio: string; url: string }>()
  const fD = await compressResponse.formData()
  console.log(compressedImage)
  console.log(fD)
  // await updateQuestionImage(question.value?.id!, question.value?.image!)
}

async function onDropzoneDrop(file: Blob) {
  await updateQuestionImage(question.value?.id!, file, file)
}

const backgroundColor = computed(() => question.value?.backgroundColor || '')
</script>

<template>
  <div class="slideEditorContainer">
    <Dropzone @dropped="onDropzoneDrop">
      <div class="slide">
        <img v-if="hasImage" class="image" :src="imageSrc" />
        <SecondaryButton
          class="changeBackgroundButton"
          bg="rgb(0 0 0 / 20%)"
          @click="imagePickerOpen = !imagePickerOpen"
        >
          <PictureIcon /> Change background
        </SecondaryButton>
        <ImagePicker
          :is-open="imagePickerOpen"
          @select="onImageSelect"
          @upload="onDropzoneDrop"
          @close="imagePickerOpen = false"
          @optimise="onOptimise"
        />
        <div class="content">
          <span v-if="!isCategory" class="count">{{ index + 1 }}</span>
          <div
            class="title"
            :class="{
              '-s': title.length > 50,
              '-xs': title.length > 80,
              '-xxs': title.length > 110,
            }"
          >
            <textarea
              v-stretchy="title"
              type="text"
              :value="title"
              :placeholder="isCategory ? 'Category name' : 'Question title'"
              class="title-textarea"
              @input="handleTitleInput"
            />
          </div>
          <ol v-if="!isCategory" ref="slideOptions" class="options">
            <li
              v-for="(option, index) in options"
              :key="`${questionId}-option-${index}`"
              class="options-item"
            >
              <div class="flex align-items-center">
                <div class="answer-key">
                  <input
                    :id="`${questionId}-radio-${index}`"
                    type="radio"
                    name="answer"
                    :value="index"
                    :checked="correctOption === index"
                    @change="setCorrectOption(index)"
                  />
                  <label :for="`${questionId}-radio-${index}`" class="answer-key-label">{{
                    letterIndex[index]
                  }}</label>
                </div>
                <input
                  v-stretchy="option"
                  type="text"
                  :value="option"
                  :placeholder="`Option ${index}`"
                  class="option-input"
                  @input="handleOptionInput($event, index)"
                />
              </div>
              <textarea
                v-if="correctOption === index"
                v-stretchy="explanation"
                type="text"
                placeholder="Explanation"
                class="explanation-input"
                :value="explanation"
                @input="handleExplanationInput"
              />
            </li>
          </ol>
        </div>
      </div>
    </Dropzone>
  </div>
</template>

<style lang="scss" scoped>
.slideEditorContainer {
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
  background-color: v-bind(backgroundColor);
}

.changeBackgroundButton {
  --background-alpha: 20%;
  position: absolute;
  z-index: 3;
  right: 1rem;
  bottom: 1rem;
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

  &.-s {
    font-size: var(--slide-title-font-size-s);
  }

  &.-xs {
    font-size: var(--slide-title-font-size-xs);
  }

  &.-xxs {
    font-size: var(--slide-title-font-size-xxs);
  }
}

.title-textarea {
  @include textarea-outline;
  width: 100%;
  height: 1.7em;
  padding: 0.4rem 1rem 0.1rem;
  padding-right: 4rem;
  margin-left: -1rem;
  word-break: break-word;

  &::placeholder {
    color: var(--placeholder-color);
  }
}

.options {
  display: flex;
  flex-direction: column;
  padding: 0 0 0 2rem;
  margin-bottom: auto;
  list-style: none;
}

.options-item {
  display: flex;
  flex-direction: column;
  margin: 0.5rem 0;
  font-size: var(--slide-option-font-size);
  transform-origin: left;
  transition: 0.25s ease;
  transition-property: opacity, transform, text-shadow;
}

.answer-key {
  display: flex;
  margin-right: 1rem;
}

.answer-key-label {
  display: flex;
  width: var(--slide-option-counter-size);
  height: var(--slide-option-counter-size);
  background: #ffffff21;
  border-radius: 5px;
  cursor: pointer;
  font-size: var(--slide-option-counter-font-size);
  place-content: center;
  place-items: center;
  transition: 0.25s ease;
  transition-property: color, background-color, box-shadow;
  will-change: color, background-color;

  input:checked + & {
    background-color: #28bb2e;
    box-shadow: 0 0 20px #28bb2e85, 0 0 60px #28bb2e50;
    color: #ffffff;
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

.explanation-input {
  @include textarea-outline;
  max-width: 100%;
  padding: 0.18rem 0.5rem;
  margin-top: 0.5rem;
  margin-left: 3rem;
  font-size: var(--slide-explanation-font-size);

  &::placeholder {
    color: var(--placeholder-color);
  }
}
</style>
