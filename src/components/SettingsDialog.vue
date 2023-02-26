<script lang="ts" setup>
import { computed, ref } from 'vue'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import dayjs from 'dayjs'
import download from 'downloadjs'
import PButton from 'primevue/button'
import { exportDatabase, importDatabase } from '@/lib/store/db'
import ModalDialog from './ModalDialog.vue'
import Fieldset from './Fieldset.vue'
import FileInput from './FileInput.vue'

async function doExport() {
  const result = await exportDatabase()
  download(result as string, `quiz-export-${dayjs().format('YYYY-MM-DD_HH:mm')}.json`, 'application/json')
}

const file = ref<File | null>(null)
function onImportFieldChange(value: File | null) {
  file.value = value
}

const isImportButtonEnabled = computed(() => file.value && file.value.type === 'application/json')

async function doImport() {
  if (file.value) {
    await importDatabase(file.value)
  }
}

const tabs = [
  { id: 'importExport', label: 'Import/Export' },
  { id: 'somethingElse', label: 'Something else' },
] as const
</script>

<template>
  <ModalDialog class="settings" title="Settings">
    <div class="settings__grid">
      <TabGroup vertical>
        <div class="settings__tabsPane">
          <TabList class="settings__tabs">
            <Tab v-for="tab in tabs" :key="tab.id" v-slot="{ selected }" class="settings__tabItem">
              <button class="settings__tabButton" :class="{ '-active': selected }" :aria-label="tab.label">
                {{ tab.label }}
              </button>
            </Tab>
          </TabList>
        </div>
        <TabPanels class="settings__tabsContent">
          <TabPanel>
            <div class="importExport">
              <p class="explainer">
                The quizzing database is stored locally inside your browser. If you want to back up your work
                or move to another computer, you can export and import all of your data below.
              </p>
              <section>
                <Fieldset title="Import">
                  <FileInput @change="onImportFieldChange" />

                  <PButton
                    label="Import database"
                    :disabled="!isImportButtonEnabled"
                    icon="pi pi-upload"
                    @click="doImport"
                  />
                </Fieldset>

                <Fieldset title="Export">
                  <PButton
                    label="Export database"
                    class="p-button-secondary"
                    icon="pi pi-arrow-circle-down"
                    @click="doExport"
                  />
                </Fieldset>
              </section>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  </ModalDialog>
</template>

<style lang="scss">
.settings {
  width: 600px;
  max-width: 100vw;
  min-height: 350px;

  &__grid {
    display: grid;
    grid-template-columns: 2fr 4fr;
  }

  &__tabs {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__tabItem {
    margin-left: -0.5rem;
  }

  &__tabButton {
    padding: 0.25rem 0.5rem;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &.-active {
      background-color: rgb(255 255 255 / 15%);
      border-radius: 4px;
    }
  }
}

.explainer {
  color: rgb(255 255 255 / 80%);
  font-size: 0.875rem;
}

.importExport {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  gap: 1rem;
}
</style>
