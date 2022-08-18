<template>
  <div class="playLayoutContainer"><slot /></div>
</template>

<style lang="scss" scoped>
.playLayoutContainer {
  display: flex;
  height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
}
</style>
