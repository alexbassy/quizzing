<script lang="ts" setup>
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import download from 'downloadjs'
import PButton from 'primevue/button'
import Dialog from 'primevue/dialog';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Fieldset from './Fieldset.vue'
import FileInput from './FileInput.vue'
import { exportDatabase, importDatabase } from '@/lib/store/db'

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
</script>

<template>
  <Dialog class="settingsDialog" header="Settings" block-scroll modal dismissable-mask :draggable="false">
    <div class="settingsDialog__grid">
      <TabView>
        <TabPanel header="Import/export">
          <div class="importExport">
            <p class="explainer">
              The quizzing database is stored locally inside your browser. If you want to back up your work
              or move to another computer, you can export and import all of your data below.
            </p>
            <section>
              <Fieldset title="Import">
                <FileInput @change="onImportFieldChange" />

                <PButton label="Import database" :disabled="!isImportButtonEnabled" icon="pi pi-upload"
                  @click="doImport" />
              </Fieldset>

              <Fieldset title="Export">
                <PButton label="Export database" class="p-button-secondary" icon="pi pi-arrow-circle-down"
                  @click="doExport" />
              </Fieldset>
            </section>
          </div>
        </TabPanel>
      </TabView>
    </div>
  </Dialog>
</template>

<style lang="scss">
.settingsDialog {
  width: 40rem;
  max-width: 100vw;
  min-height: 350px;

  &__grid {
    /* display: grid;
    grid-template-columns: 2fr 4fr; */
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
