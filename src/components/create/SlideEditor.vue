<script lang="ts" setup>
import { onMounted$ } from '@/composable/useObservable'
import { watch$ } from '@/lib/observables'
import { updateQuestionOption, updateQuestionTitle } from '@/lib/store/client'
import { QuestionEntry } from '@/lib/store/db'
import { useSubscription } from '@vueuse/rxjs'
import { combineLatest, fromEvent, startWith } from 'rxjs'
import * as Stretchy from 'stretchy'
import { computed, nextTick, ref } from 'vue'

const props = defineProps<{ question: QuestionEntry }>()

const hasImage = ref(false)
const imageSrc = computed(() => props.question.image)

const title = computed(() => props.question.title || '')
const id$ = watch$(() => props.question.id)

const options = computed(() =>
  Array.from({ length: 4 }).map((_, i) => props.question.options?.[i] || '')
)

async function handleTitleInput(ev: Event) {
  resizeTitleInput()
  await updateQuestionTitle(props.question.id!, (ev.target as HTMLTextAreaElement).value)
}

async function handleOptionInput(ev: Event, index: number) {
  Stretchy.resize(ev.target as HTMLTextAreaElement)
  await updateQuestionOption(props.question.id!, index, (ev.target as HTMLTextAreaElement).value)
}

// Resize question textarea on input and window resize
const slideTitle = ref<HTMLTextAreaElement>()
function resizeTitleInput() {
  Stretchy.resize(slideTitle.value)
}
useSubscription(
  combineLatest([id$, onMounted$(), fromEvent(window, 'resize').pipe(startWith(null))]).subscribe(
    () => nextTick(() => resizeTitleInput())
  )
)
</script>

<template>
  <div class="container">
    <div class="slide" :style="`--background-color: ${question.backgroundColor};`">
      <img v-if="hasImage" class="image" :src="imageSrc" />
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
  width: 100%;
  height: 100%;
  background-color: var(--background-color);
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
  height: 100vh;
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
  padding: 0 0 3rem 2rem;
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
