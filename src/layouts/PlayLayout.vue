<template>
  <div class="container"><slot /></div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.container {
  display: flex;
  height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
}
</style>
