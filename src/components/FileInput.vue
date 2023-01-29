<script lang="ts" setup>
import { ref } from 'vue'
import { formatBytes } from '@/lib/format-bytes'

const emit = defineEmits(['change'])

const description = ref('')

function onChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const { name: fileName, size } = file
    const fileNameAndSize = `${fileName} - ${formatBytes(size)}`
    description.value = fileNameAndSize
    emit('change', file)
  } else {
    description.value = ''
    emit('change', null)
  }
}
</script>

<template>
  <div class="fileInput">
    <input id="fileInput" type="file" class="fileInput__input" @change="onChange" />
    <label for="fileInput" class="fileInput__label">
      <span class="fileInput__button">Select file</span>
      <p class="fileInput__name">{{ description }}</p>
    </label>
  </div>
</template>

<style lang="scss" scoped>
.fileInput {
  margin-bottom: 0.5rem;

  &__input {
    position: absolute;
    width: 0.1px;
    height: 0.1px;
    opacity: 0;

    /* Adding an outline to the label on focus */
    &:focus + label {
      box-shadow: 0 0 0 2px rgba(255 255 255 / 10%);
    }
  }

  &__label {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    border: 1px solid rgba(255 255 255 / 15%);
    border-radius: 6px;
    color: #fff;
    cursor: pointer;
  }

  &__button {
    width: fit-content;
    flex-shrink: 0;
    margin-right: 1rem;
    font-weight: bold;
  }

  &__name {
    color: #555;
    font-size: 0.85rem;
  }
}
</style>
