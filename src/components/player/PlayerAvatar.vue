<script lang="ts" setup>
import { computed } from 'vue'
import { type PlayerEntry } from '@/lib/store/db'

const props = defineProps<{ player: PlayerEntry; size?: 'large' | 'medium' | 'small' }>()

const initials = computed(() =>
  props.player.name
    ?.split(' ')
    .map((word) => word[0])
    .join('')
)
const imageSrc = computed(() =>
  props.player.photo ? URL.createObjectURL(props.player.photo) : undefined
)

const backgroundColor = computed(() => props.player.backgroundColor ?? '#fff')
</script>

<template>
  <span class="player" :class="{ '-large': size === 'large', '-medium': size === 'medium' }">
    <div class="background">
      <img v-if="imageSrc" :src="imageSrc" class="photo" />
    </div>
    <span v-if="!imageSrc" class="initials">{{ initials }}</span>
  </span>
</template>

<style lang="scss" scoped>
.player {
  position: relative;
  display: flex;
  width: 50px;
  height: 50px;
  align-items: center;
  justify-content: center;
  border-radius: 100px;

  &.-medium {
    width: 75px;
    height: 75px;
  }

  &.-large {
    width: 100px;
    height: 100px;
  }
}

.background {
  position: absolute;
  overflow: hidden;
  width: 100%;
  height: 100%;
  background-color: v-bind('backgroundColor');
  border-radius: 100px;
}

.photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.initials {
  position: relative;
  z-index: 2;
  color: #fff;
  text-shadow: 0 1px 5px #00000030;

  .-large & {
    font-size: 2rem;
  }
}
</style>
