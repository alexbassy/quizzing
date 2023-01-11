<script lang="ts" setup>
import { nextTick, provide, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import * as Stretchy from 'stretchy'
import { useObservable, useSubscription } from '@vueuse/rxjs'
import { take } from 'rxjs/operators'
import SlideEditor from '@/components/create/SlideEditor.vue'
import SlideList from '@/components/create/SlideList.vue'
import CaretLeftIcon from '@/components/icons/CaretLeftIcon.vue'
import CreateLayout from '@/layouts/CreateLayout.vue'
import { getQuestions$, getQuiz$, updateQuizTitle } from '@/lib/store/client'
import { QuestionEntry, QuizEntry } from '@/lib/store/db'
import PlayDialog from '@/components/create/PlayDialog.vue'
import PrimaryButton from '@/components/PrimaryButton.vue'
import SecondaryButton from '@/components/SecondaryButton.vue'

const route = useRoute()

const quizId = route.params.id as string
provide('quizId', quizId)

const quiz$ = getQuiz$(quizId)
const quiz = useObservable<QuizEntry | undefined>(quiz$)
const questions = useObservable(getQuestions$(quizId), { initialValue: [] as QuestionEntry[] })
const activeQuestion = ref<QuestionEntry | undefined>(questions.value?.[0] ?? undefined)

watch(questions, (value, oldValue) => {
  if (oldValue.length === 0 && value.length > 0) {
    activeQuestion.value = value[0]
  }
})

function onSlideChange(id: QuestionEntry['id']) {
  activeQuestion.value = questions.value.find((q) => q.id === id)!
}

// Resize the title input when the quiz data is loaded
const titleInput = ref<HTMLInputElement>()
useSubscription(
  quiz$.pipe(take(1)).subscribe((value) => nextTick(() => Stretchy.resize(titleInput.value)))
)

// Save the title input value to the database and resize on input
async function handleTitleChange(ev: Event) {
  Stretchy.resize(ev.target as HTMLInputElement)
  await updateQuizTitle(quizId, (ev.target as HTMLInputElement).value)
}

const isPlayDialogShown = ref(false)
function showPlayDialog() {
  isPlayDialogShown.value = true
}
</script>

<template>
  <CreateLayout>
    <template #title>
      <SecondaryButton to="/create" inline is-icon>
        <CaretLeftIcon />
      </SecondaryButton>
      <input
        ref="titleInput"
        type="text"
        class="title-input"
        :value="quiz?.name"
        placeholder="Untitled"
        maxlength="40"
        @input="handleTitleChange"
      />
    </template>

    <template #action>
      <PrimaryButton bg="#ef476f" @click="showPlayDialog">Play</PrimaryButton>
    </template>

    <template #sidebar>
      <SlideList
        :questions="questions"
        :active-question-id="activeQuestion?.id"
        @active-change="onSlideChange"
      />
    </template>

    <SlideEditor v-if="activeQuestion" :question-id="activeQuestion.id!" />

    <PlayDialog
      :visible="isPlayDialogShown"
      @cancel="isPlayDialogShown = false"
      @close="isPlayDialogShown = false"
    />
  </CreateLayout>
</template>

<style lang="scss" scoped>
.title-input {
  @include textarea-outline;
  display: inline-block;
  margin: 0 auto 0 0;
  font-size: var(--create-header-font-size);
  font-weight: normal;

  &::placeholder {
    color: var(--placeholder-color);
  }
}
</style>
