<script lang="ts" setup>
import { QuestionEntry } from '@/lib/store/db'
import { useSubscription } from '@vueuse/rxjs'
import { animationFrameScheduler, debounceTime, fromEvent, startWith } from 'rxjs'
import * as Stretchy from 'stretchy'
import { computed, defineProps, onMounted, ref } from 'vue'

const props = defineProps<{ question: QuestionEntry }>()

const hasImage = ref(false)
const imageSrc = computed(() => props.question.image)

const title = computed(() => props.question.title || 'No title')

const options = computed(() =>
  Array.from({ length: 4 }).map((_, i) => props.question.options?.[i] || '')
)

const slideTitle = ref<HTMLTextAreaElement>()

function resizeTitleInput() {
  Stretchy.resize(slideTitle.value)
}

onMounted(() => {
  useSubscription(
    fromEvent(window, 'resize')
      .pipe(debounceTime(10, animationFrameScheduler), startWith(null))
      .subscribe(() => {
        console.log('resize')
        resizeTitleInput()
      })
  )
})
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
            placeholder="Title..."
            ref="slideTitle"
            class="title-textarea"
            @input="resizeTitleInput"
          />
        </div>
        <ol class="options" ref="slideOptions">
          <li v-for="(option, i) in options" class="options-item">
            <input type="text" :value="option" :placeholder="`Option ${i}`" class="option-input" />
          </li>
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
  background-color: var(--background-color);
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

.content {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #fff;
  z-index: 2;
  width: var(--slide-content-width);
  height: 100vh;
  background: var(--slide-content-gradient);
  padding: 0 var(--slide-content-padding-right) 0 var(--slide-content-padding-left);
}

.count {
  font-size: var(--slide-count-font-size);
  padding-left: 2rem;
  font-weight: 600;
  color: #ffffff80;
  margin: auto 0 0;
}

.title {
  display: flex;
  font-size: var(--slide-title-font-size);
  margin: 0.5em 0;
  font-weight: 800;
}

.title-textarea {
  @include textarea-outline;
  word-break: break-word;
  padding: 0.4rem 1rem 0.1rem;
  margin-left: -1rem;
}

.options {
  list-style: none;
  padding: 0 0 0 2rem;
  counter-reset: option-counter;
  margin-bottom: auto;
}

.options-item {
  display: flex;
  align-items: center;
  font-size: var(--slide-option-font-size);
  margin: 1.4rem 0;
  transform-origin: left;
  counter-increment: option-counter;
  transition: 0.25s ease;
  transition-property: opacity, transform, text-shadow;
  transform-origin: left;

  ::placeholder {
    color: rgb(255 255 255 / 40%);
  }

  &::before {
    content: counter(option-counter, upper-alpha);
    margin-right: 1rem;
    background: #ffffff21;
    align-self: flex-start;
    display: flex;
    flex-shrink: 0;
    font-size: var(--slide-option-counter-font-size);
    width: var(--slide-option-counter-size);
    height: var(--slide-option-counter-size);
    text-align: center;
    place-content: center;
    place-items: center;
    border-radius: 5px;
    transition: 0.25s ease;
    transition-property: color, background-color, box-shadow;
    will-change: color, background-color;
  }

  &.-answerShown.-correct {
    &::before {
      color: #ffffff;
      background-color: #28bb2e;
      box-shadow: 0 0 20px #28bb2e85, 0 0 60px #28bb2e50;
    }
  }

  &.-answerShown {
    opacity: 0.2;
    text-shadow: 0 0 30px rgb(0 0 0 / 100%);

    &.-correct {
      opacity: 1;
    }
  }
}

.option-input {
  @include textarea-outline;
  font-size: var(--slide-option-font-size);
  padding: 0.18rem 0.5rem;
  margin-left: -0.5rem;

  ::placeholder {
    color: rgb(255 255 255 / 40%);
  }
}
</style>
