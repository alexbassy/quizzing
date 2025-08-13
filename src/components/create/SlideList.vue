<script lang="ts" setup>
import { inject, nextTick, ref, watch } from 'vue'
import ContextMenu from 'primevue/contextmenu'
import type { MenuItem } from 'primevue/menuitem'
import * as client from '@/lib/store/client'
import { QuestionEntry, QuestionType } from '@/lib/store/db'
import SlideListItem from './SlideListItem.vue'
import { parseQuizMarkdown, createQuestionEntries } from '@/lib/quiz-parser'

const props = defineProps<{ questions: QuestionEntry[]; activeQuestionId?: string }>()
const quizId = inject<string>('quizId')
const listElem = ref<HTMLOListElement>()

const emit = defineEmits(['active-change'])

function setActiveSlide(questionId: string) {
  emit('active-change', questionId)
}

async function addQuestion(extraArgs: Partial<QuestionEntry> = {}) {
  const id = await client.addQuestion({ quizId: quizId!, ...extraArgs })
  setTimeout(() => {
    if (listElem.value) {
      listElem.value.scrollTo({ top: listElem.value.scrollHeight * 2, behavior: 'smooth' })
      emit('active-change', id)
    }
  }, 300)
}

async function deleteQuestion(questionId: string) {
  if (!quizId || !questionId) {
    console.warn('Attempting to delete quiz; quiz ID or question ID is undefined')
    return
  }
  if (props.activeQuestionId === questionId) {
    const questionIndex = props.questions.findIndex((question) => question.id === questionId)
    const nextIndex = props.questions[questionIndex + 1]?.id || props.questions[questionIndex - 1]?.id || null
    emit('active-change', nextIndex)
  }
  await client.deleteQuestion(quizId, questionId)
}

// Scroll to the active question when the page loads
const didInitialScroll = ref(false)
watch(
  () => props.activeQuestionId,
  (questionId) => {
    if (didInitialScroll.value || !questionId) return
    if (!questionId && Object.keys(props.questions || {}).length > 0) {
      didInitialScroll.value = true
      return
    }
    nextTick(() => scrollQuestionIntoView(questionId))
    didInitialScroll.value = true
  }
)

function scrollQuestionIntoView(questionId: string) {
  const questionElem = document.getElementById(questionId)
  if (questionElem) questionElem.scrollIntoView({ block: 'center' })
}

function dragStart(ev: DragEvent, id: string) {
  if (!ev.dataTransfer) return
  ev.dataTransfer.effectAllowed = 'move'
  ev.dataTransfer.setData('text', id)
}

const dropTarget = ref()
function dragOver(ev: DragEvent, id: string) {
  if (ev.preventDefault) {
    ev.preventDefault() // Necessary. Allows us to drop.
  }

  if (dropTarget.value === id) return
  ev.dataTransfer!.dropEffect = 'move'
  dropTarget.value = id
}

function dragLeave() {
  dropTarget.value = null
}

function dragEnd() {
  dropTarget.value = null
}

function drop(event: DragEvent, targetId: string) {
  if (!dropTarget.value) return
  const draggedId = event.dataTransfer?.getData('text')
  if (!draggedId || draggedId === targetId) return
  client.moveQuestion(quizId!, draggedId, targetId)
}

const contextMenuRef = ref<ContextMenu>()
const openContextMenu = (event: Event) => {
  contextMenuRef.value?.show(event)
}

async function pasteQuiz() {
  try {
    const text = await navigator.clipboard.readText()
    const parsedQuestions = parseQuizMarkdown(text)

    if (parsedQuestions.length === 0) {
      alert('No valid questions found in the pasted text. Please check the format.')
      return
    }

    const questionEntries = createQuestionEntries(parsedQuestions, quizId!)

    // Add all questions to the database
    const addedQuestions: string[] = []
    for (const questionData of questionEntries) {
      const id = await client.addQuestion(questionData)
      addedQuestions.push(id)
    }

    // Scroll to the first added question and make it active
    if (addedQuestions.length > 0) {
      setTimeout(() => {
        if (listElem.value) {
          listElem.value.scrollTo({ top: listElem.value.scrollHeight * 2, behavior: 'smooth' })
          emit('active-change', addedQuestions[0])
        }
      }, 300)
    }

    alert(`Successfully added ${parsedQuestions.length} question(s) to the quiz!`)
  } catch (error) {
    console.error('Failed to paste quiz:', error)
    alert('Failed to paste quiz. Please make sure you have copied text to your clipboard.')
  }
}

const questionActionModel: MenuItem[] = [
  {
    id: 'category',
    icon: 'pi pi-play',
    label: 'Add Category',
    command: () => {
      addQuestion({ type: QuestionType.Category })
    },
  },
  {
    id: 'paste',
    icon: 'pi pi-clipboard',
    label: 'Paste Quiz',
    command: pasteQuiz,
  },
]
</script>

<template>
  <div class="slideList">
    <ol ref="listElem" v-auto-animate class="slideList__container">
      <SlideListItem
        v-for="(question, index) in questions"
        :id="question.id"
        :key="question.id"
        :question="question"
        :index="index"
        :is-active="question.id === activeQuestionId"
        :dragged-over="dropTarget === question.id"
        @set-active="setActiveSlide($event)"
        @delete="deleteQuestion($event)"
        @dragstart="dragStart($event, question.id!)"
        @dragover="dragOver($event, question.id!)"
        @dragend="dragEnd"
        @dragleave="dragLeave"
        @drop="drop($event, question.id!)"
      />
      <li class="slideList__actions">
        <button aria-label="Add question" class="slideList__addQuestion" @click="addQuestion()">+</button>
        <button aria-label="Add something else" class="slideList__addOption" @click="openContextMenu">
          ...
        </button>
        <ContextMenu ref="contextMenuRef" :model="questionActionModel" />
      </li>
    </ol>
  </div>
</template>

<style lang="scss" scoped>
.slideList {
  position: relative;
  height: 100%;

  &::before,
  &::after {
    position: absolute;
    z-index: 2;
    width: 100%;
    height: 1.5rem;
    content: '';
    pointer-events: none;
  }

  &::before {
    top: 0;
    background: linear-gradient(to bottom, #000000, #00000000);
  }

  &::after {
    bottom: 0; // I don't understand this
    background: linear-gradient(to top, #000000aa, #00000000);
  }

  &__container {
    max-width: 100%;
    height: 100%;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    overflow-y: auto;
  }

  &__actions {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
    aspect-ratio: 4 / 3;
  }

  &__addQuestion {
    flex: 3;
    border-right: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 8px 0 0 8px;
  }

  &__addOption {
    flex: 1;
    border-radius: 0 8px 8px 0;
  }

  &__addQuestion,
  &__addOption {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    padding-bottom: 0.35rem;
    appearance: none;
    background-color: rgb(30 30 30);
    cursor: pointer;
    font-size: 3vw;
    transition: 0.25s ease;
    transition-property: transform, background-color, box-shadow;

    &:focus-visible {
      box-shadow: 0 0 0 0.25rem blue;
    }

    &:active {
      background-color: rgb(25 25 25);
      transform: scale(0.975);
    }
  }
}
</style>
