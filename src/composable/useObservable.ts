import { onBeforeUnmount, onMounted, Ref, ref } from 'vue'
import { Observable, Subscription } from 'rxjs'

export function useObservable<T>(obs$: Observable<T>): Ref<T | undefined> {
  const valueRef = ref<T>()
  useSubscribe(obs$, (value) => (valueRef.value = value))
  return valueRef
}

export function useSubscribe<T>(obs$: Observable<T>, callback: (value: T) => unknown) {
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
