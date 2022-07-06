<script lang="ts" setup>
import { ref } from 'vue'
import PhotoIcon from '@/components/icons/PhotoIcon.vue'

const emit = defineEmits<{
  (event: 'dropped', file: Blob): void
}>()

const isDropping = ref(false)

async function onDrop(ev: DragEvent) {
  ev.dataTransfer!.dropEffect = 'copy'
  const item = ev.dataTransfer?.items[0]
  if (!isImageDataTransferItem(item!)) {
    return
  }
  const file = item?.getAsFile()
  const buffer = await file?.arrayBuffer()
  const blob = new Blob([buffer!], { type: file?.type })
  emit('dropped', blob)
  isDropping.value = false
}

const isImageDataTransferItem = (item: DataTransferItem) =>
  item.kind === 'file' && item.type.startsWith('image')

// Update the appearance of the dropzone when dropping an image
const onDragOver = (ev: DragEvent) => {
  return (isDropping.value = isImageDataTransferItem(ev.dataTransfer?.items[0]!))
}

const onDragLeave = () => (isDropping.value = false)
</script>

<template>
  <div
    class="dropzone"
    :class="{ '-visible': isDropping }"
    @dragover.prevent="onDragOver"
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
  >
    <slot />
    <div class="dropzone-visible-area">
      <div><PhotoIcon class="dropzone-icon" /></div>
      Drop an image to add it to the slide
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dropzone {
  width: 100%;
  height: 100%;
}

.dropzone-visible-area {
  position: absolute;
  z-index: 5;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;

  .-visible & {
    opacity: 1;
  }
}

.dropzone-icon {
  width: 3rem;
  height: 3rem;
}
</style>
