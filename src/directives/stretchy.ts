import { createApp } from 'vue'
import * as Stretchy from 'stretchy'
import { nanoid } from 'nanoid'
import { debounceTime, fromEvent, Subscription } from 'rxjs'

const subscriptions: Record<string, Subscription> = {}

export default function addStretchyDirective(app: ReturnType<typeof createApp>) {
  app.directive('stretchy', {
    async mounted(el: HTMLElement) {
      // Wait for fonts to load before resizing
      await document.fonts.ready
      Stretchy.resize(el)

      // Add a resize listener
      const id = nanoid()
      el.dataset.stretchyId = id
      subscriptions[id] = fromEvent(window, 'resize')
        .pipe(debounceTime(100))
        .subscribe(() => {
          Stretchy.resize(el)
        })
    },
    updated(el, binding) {
      // Don't resize if the value hasn't changed
      if (binding.oldValue === binding.value) return
      Stretchy.resize(el)
    },
    beforeUnmount(el) {
      // Remove the resize listener
      const id = el.dataset.stretchyId
      if (id && subscriptions[id]) {
        subscriptions[id].unsubscribe()
      }
    },
  })
}
