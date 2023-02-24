<script lang="ts" setup>
import { ref } from 'vue'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import type { IUnsplashSearchResult } from '@/worker/types'
import FileInput from '../FileInput.vue'

defineProps<{ isOpen: boolean }>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', image: IUnsplashSearchResult): void
  (e: 'upload', file: File): void
  (e: 'optimise'): void
}>()

const query = ref<string>('')
const results = ref<IUnsplashSearchResult[]>([])

async function searchPictures() {
  const q = query.value
  if (!q || !q.match(/[a-z0-9]/i)) {
    results.value = []
    return
  }
  const response = await fetch(`https://api.quizzing.ninja/backgrounds/search?query=${query.value}`).then(
    (res) => res.json() as Promise<IUnsplashSearchResult[]>
  )
  results.value = response
}

function onFileChange(file: File | null) {
  if (file && file.type.startsWith('image/')) {
    emit('upload', file)
    emit('close')
  }
}
</script>

<template>
  <div class="imagePicker" :class="{ '-visible': isOpen }">
    <TabGroup>
      <TabList class="imagePicker__tabList">
        <Tab
          v-for="tab in ['Unsplash', 'Upload', 'Optimise']"
          :key="tab"
          v-slot="{ selected }"
          class="imagePicker__tabItem"
        >
          <button class="imagePicker__tabButton" :class="{ '-active': selected }" :aria-label="tab">
            {{ tab }}
          </button>
        </Tab>
      </TabList>
      <TabPanels class="imagePicker__tabPanels">
        <TabPanel class="imagePicker__tabPanel">
          <form class="search-form" @submit.prevent="searchPictures">
            <input
              v-model="query"
              type="text"
              placeholder="Search for images"
              class="search-field"
              autofocus
            />
          </form>
          <div class="results">
            <ul v-if="results.length" class="results-list">
              <li v-for="result in results" :key="result.id" class="result">
                <figure>
                  <img
                    :src="result.urls.thumb"
                    :style="`background-color: ${result.color}`"
                    :alt="result.description ?? ''"
                    class="result-image"
                    tabindex="0"
                    @click="$emit('select', result)"
                  />
                  <figcaption>
                    by <a :href="result.credit.url" target="_blank">{{ result.credit.name }}</a>
                  </figcaption>
                </figure>
              </li>
            </ul>
          </div>
        </TabPanel>
        <TabPanel class="imagePicker__tabPanel">
          <FileInput @change="onFileChange" />
        </TabPanel>
        <TabPanel class="imagePicker__tabPanel">
          <button @click="emit('optimise')">Optimise background image</button>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  </div>
</template>

<style lang="scss" scoped>
.imagePicker {
  position: absolute;
  z-index: 3;
  right: 1rem;
  bottom: 4rem;
  display: flex;
  width: 500px;
  height: 280px;
  flex-direction: column;
  padding: 1rem;
  border: 1px solid rgb(255 255 255 / 5%);
  backdrop-filter: blur(5px);
  background: rgb(0 0 0 / 50%);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0 0 0 / 10%);
  opacity: 0;
  pointer-events: none;
  transform: scale(0.95);
  transform-origin: bottom right;
  transition: 0.15s ease;
  transition-property: transform, opacity;

  &.-visible {
    opacity: 1;
    pointer-events: unset;
    transform: scale(1);
  }

  &__tabList {
    display: flex;
    margin-bottom: 0.5rem;
    gap: 0.5rem;
  }

  &__tabButton {
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    opacity: 0.85;
    transition: 0.2s ease;
    transition-property: background-color, opacity;

    &.-active {
      background-color: rgba(255 255 255 / 20%);
      opacity: 1;
    }
  }

  &__tabPanels {
    display: flex;
    max-height: 100%;
    flex-direction: column;
    padding-bottom: 2rem;
  }

  &__tabPanel {
    display: flex;
    max-height: 100%;
    flex-direction: column;
  }
}

.search-form {
  display: flex;
  width: 100%;
}

.search-field {
  flex: 1;
  padding: 0.35rem 0.65rem;
  background: rgb(255 255 255 / 10%);
  border-radius: 3px;
  color: #fff;

  &::placeholder {
    color: rgb(255 255 255 / 30%);
  }
}

.results {
  flex: 1;
  margin-top: 1rem;
  overflow-y: auto;
}

.results-list {
  column-count: 3;
  column-gap: 0.75rem;
}

.result {
  display: flex;
  overflow: hidden;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
}

figure {
  max-width: 100%;
}

figcaption {
  overflow: hidden;
  max-width: 100%;
  color: rgb(255 255 255 / 50%);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-image {
  width: 100%;
  height: auto;
  border-radius: 3px;
}
</style>
