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
  const file = fileInput.value?.files?.[0]
  if (file) {
    await importDatabase(file)
  }
}

const tabs = [
  { id: 'importExport', label: 'Import/Export' },
  { id: 'somethingElse', label: 'Something else' },
] as const

const activeTab = ref(tabs[0].id)
</script>

<template>
  <Dialog v-slot="{ close }" v-bind="$attrs" class="settings">
    <div class="settings__tabsPane">
      <h1 class="title">Settings</h1>
      <ul class="settings__tabs">
        <li v-for="tab in tabs" :key="tab.id" class="settings__tabItem">
          <button
            class="settings__tabItem"
            :class="{ '-active': activeTab === tab.id }"
            :aria-label="tab.label"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </li>
      </ul>
    </div>
    <div class="settings__tabsContent">
      <div v-if="activeTab === 'importExport'">
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
      </div>
    </div>
  </Dialog>
</template>

<style lang="scss" scoped>
.settings {
  display: grid;
  width: 600px;
  max-width: 100vw;
  height: 350px;
  grid-template-columns: 2fr 4fr;

  &__tabs {
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
  }

  &__tabItem {
    padding: 0.25rem 0.5rem;
    margin-left: -0.5rem;
    &.-active {
      background: rgb(255 255 255 / 15%);
    }
  }
}

.importExport {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  gap: 1rem;
}
</style>
