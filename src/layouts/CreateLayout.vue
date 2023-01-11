<template>
  <div class="createLayoutContainer">
    <header class="header">
      <div class="header-title"><slot name="title" /></div>
      <div class="header-action">
        <slot name="action" />
      </div>
    </header>
    <div class="contentWrap">
      <aside v-if="$slots.sidebar" class="sidebar"><slot name="sidebar" /></aside>
      <main class="content"><slot /></main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.createLayoutContainer {
  display: flex;
  height: 100vh;
  flex-direction: column;
  color: #fff;
}

.contentWrap {
  display: flex;
  height: calc(100% - var(--create-header-height));
  flex: 1;
}

.header {
  display: flex;
  height: var(--create-header-height);
  align-items: center;
  padding: 1.2rem 1.5rem;
}

.header-title {
  margin-right: auto;
}

.content {
  flex: 4;
}

.sidebar {
  overflow: auto;
  flex: 1;
}
</style>
