<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: undefined,
  },
})
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset__legend">{{ title }}</legend>
    <slot />
  </fieldset>
</template>

<style lang="scss" scoped>
.fieldset {
  margin-bottom: 1.5rem;

  &__legend {
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: bold;
    line-height: 1.2;
  }
}
</style>
