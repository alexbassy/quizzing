<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps<{ isOpen: boolean }>()

const query = ref<string>('')
const results = ref<any[]>([])

async function searchPictures() {
  // todo: sanitise this
  const response = await fetch(
    `https://quizzing.abass.workers.dev/backgrounds/search?query=${query.value}`
  ).then((res) => res.json())
  console.log(response)
  results.value = response
}
</script>

<template>
  <div class="imagePicker" :class="{ '-visible': isOpen }">
    <form @submit.prevent="searchPictures" class="search-form">
      <input
        type="text"
        v-model="query"
        placeholder="Search for images"
        class="search-field"
        autofocus
      />
    </form>
    <ul v-if="results.length" class="results" v-auto-animate>
      <li v-for="result in results" class="result" :key="result.id">
        <img
          :src="result.urls.thumb"
          width="100"
          :style="`background-color: ${result.color}`"
          :alt="result.alt_description"
        />
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.imagePicker {
  position: absolute;
  z-index: 3;
  right: 1rem;
  bottom: 4rem;
  display: flex;
  width: 460px;
  height: 240px;
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
  column-count: 4;
  column-gap: 0.5rem;
  overflow-y: auto;
}

.result {
  display: flex;
  overflow: hidden;
  margin-bottom: 0.5rem;
  border-radius: 3px;
}
</style>
