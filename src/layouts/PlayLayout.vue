<template>
  <div class="container"><slot /></div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
}
</style>
