<template>
  <CreateLayout title="Create">
    <template #sidebar>
      <SlideList :questions="questions" @active-change="onSlideChange" />
    </template>
    <SlideEditor :question="activeQuestion" />
  </CreateLayout>
</template>

<script lang="ts" setup>
import CreateLayout from '@/layouts/CreateLayout.vue'
import SlideList from '@/components/create/SlideList.vue'
import { IQuestion, questions } from '@/lib/questions'
import { ref } from 'vue'
import SlideEditor from '@/components/create/SlideEditor.vue'

const activeQuestion = ref<IQuestion>(questions[0])

function onSlideChange(id: IQuestion['id']) {
  activeQuestion.value = questions.find((q) => q.id === id)!
}
</script>

<style lang="scss" scoped>
.create {
}
</style>
