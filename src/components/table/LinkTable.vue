<script lang="ts" setup>
import { defineProps, useSlots, VNode } from 'vue'
import { type Component } from '@vue/runtime-core'
import { LinkTableColumn } from '.'

type Data = unknown & { id?: string }

const props = defineProps<{
  data?: Data[]
  rowLink: (entity: Data) => string
}>()

const slots = useSlots()

// We only want to render the `LinkTableColumn` children
const children: VNode[] = slots.default!({ data: props.data })
const columns = children.filter((child) => (child.type as Component)?.name === LinkTableColumn.name)
</script>

<template>
  <div class="table" role="table">
    <div role="rowgroup">
      <div class="titles" role="row">
        <span v-for="column in columns" role="columnheader">{{ column.props?.title }}</span>
      </div>
    </div>
    <ol class="list" v-if="data?.length" role="rowgroup" v-auto-animate>
      <li class="item" v-for="entity in data" :key="entity.id" role="row">
        <RouterLink class="link" :to="rowLink(entity)">
          <span v-for="column in columns" role="cell">
            <component :is="(column.children as any).default" v-bind="entity" />
          </span>
        </RouterLink>
      </li>
    </ol>
    <div class="list -empty" v-else>
      <slot name="empty" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table {
  --count: v-bind('columns.length');
  --column-spans: repeat(var(--count), 1fr);
}

.titles {
  display: grid;
  margin: 0 3.5rem;
  color: rgb(255 255 255 / 0.35);
  font-size: 0.875rem;
  font-weight: bold;
  grid-template-columns: var(--column-spans);

  > span:not(:first-of-type) {
    text-align: center;
  }
  > span:last-of-type {
    display: flex;
    justify-content: flex-end;
  }
}

.list {
  height: 100%;
  padding: 0.5rem;
  margin-top: 1rem;
  background-color: rgb(255 255 255 / 5%);
  border-radius: 10px;

  &.-empty {
    padding: 3rem;
    text-align: center;
  }
}

.item {
  display: flex;
  margin: 0.25rem 0;

  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.link {
  display: grid;
  width: 100%;
  align-items: center;
  padding: 0.85rem 1rem;
  border-radius: 8px;
  grid-template-columns: var(--column-spans);
  transition: background-color 0.15s ease;

  &:hover {
    background-color: rgb(255 255 255 / 7.5%);
  }

  &:focus-visible {
    box-shadow: inset 0 0 0 2px rgba(255 255 255 / 0.1);
  }

  > span:not(:first-of-type) {
    text-align: center;
  }
  > span:last-of-type {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
