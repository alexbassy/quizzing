import { Observable, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { onBeforeUnmount, Ref, shallowRef, watch } from 'vue'

export function safeSubscribe<T>(
  obs$: Observable<T>,
  next: (value: Readonly<T>) => void,
  error?: () => void
): void {
  const unsubscribe$ = new Subject<void>()
  obs$.pipe(takeUntil(unsubscribe$)).subscribe(next, error)

  onBeforeUnmount(() => {
    unsubscribe$.next()
    unsubscribe$.complete()
  })
}

export function useObservable<T, D extends T | undefined>(
  obs$: Observable<T>,
  defaultValue?: D
): Ref<Readonly<D extends T ? T : T | D>> {
  const r = shallowRef(defaultValue)

  safeSubscribe(obs$, (newValue) => (r.value = newValue as any))

  return r as any
}

export function watch$<T>(ref: (() => T) | Ref<T>): Observable<T> {
  return new Observable((subscriber) => {
    watch(ref, (newValue) => subscriber.next(newValue), { immediate: true })
  })
}
