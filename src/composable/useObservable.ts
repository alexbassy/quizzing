import { Observable, Subscription } from 'rxjs'
import { onBeforeUnmount, onMounted, ref } from 'vue'

export function useObservable<T>(obs$: Observable<T>) {
  const valueRef = ref<T>()
  safeSubscribe(obs$, (value) => (valueRef.value = value))
}

export function safeSubscribe<T>(obs$: Observable<T>, callback: (value: T) => unknown) {
  let subscription: Subscription
  onMounted(() => {
    subscription = obs$.subscribe((data) => callback(data))
  })
  onBeforeUnmount(() => {
    subscription.unsubscribe()
  })
}

export function onMounted$(): Observable<void> {
  return new Observable((subscriber) => {
    onMounted(() => {
      subscriber.next()
      subscriber.complete()
    })
  })
}
