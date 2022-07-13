<script lang="ts" setup>
import { type PlayerEntry } from '@/lib/store/db'
import { computed } from 'vue'

interface Props extends PlayerEntry {}
const props = defineProps<{ player: PlayerEntry }>()

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
  <span class="player">
    <div class="background">
      <img v-if="imageSrc" :src="imageSrc" />
    </div>
    <span class="initials" v-if="!imageSrc">{{ initials }}</span>
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
  border-radius: 40px;
}
.background {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: v-bind('backgroundColor');
  border-radius: 40px;
}

.initials {
  position: relative;
  z-index: 2;
  color: #fff;
  text-shadow: 0 1px 5px #00000030;
}
</style>
