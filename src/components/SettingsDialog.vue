<script lang="ts" setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
import download from 'downloadjs'
import { exportDatabase, importDatabase } from '@/lib/store/db'
import Dialog from './Dialog.vue'
import PrimaryButton from './PrimaryButton.vue'
import SecondaryButton from './SecondaryButton.vue'

async function doExport() {
  const result = await exportDatabase()
  download(result as string, `quiz-export-${dayjs().format('YYYY-MM-DD_HH:mm')}.json`, 'application/json')
}

const fileInput = ref<HTMLInputElement | null>(null)

async function doImport() {
  const [file] = fileInput.value?.files
  if (file) {
    await importDatabase(file)
  }
}
</script>

<template>
  <Dialog v-slot="{ close }" v-bind="$attrs">
    <h1 class="title">Settings</h1>
    <div class="importExport">
      <section>
        <h2>Import</h2>
        <input ref="fileInput" type="file" />
        <SecondaryButton type="button" class="" @click="doImport">Import quizzes</SecondaryButton>

        <h2>Export</h2>
        <PrimaryButton type="button" @click="doExport">Export database</PrimaryButton>
      </section>
    </div>
    <div class="playDialogActions">
      <SecondaryButton type="button" @click="close">Close</SecondaryButton>
    </div>
  </Dialog>
</template>

<style lang="scss" scoped>
.settingsDialog {
}

.importExport {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  gap: 1rem;
}
</style>
