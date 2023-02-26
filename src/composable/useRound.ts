import { switchMap } from 'rxjs/operators'
import { useRoute } from 'vue-router'
import { Observable } from 'rxjs'
import { getRound$ } from '@/lib/store/client'
import { watch$ } from '@/lib/observables'

export function useRoundId$(): Observable<string | null> {
  const route = useRoute()
  return watch$(() => route.params.roundId as string)
}

export default function useRound$() {
  const route = useRoute()
  const roundId$ = watch$(() => route.params.roundId as string)
  const round$ = roundId$.pipe(switchMap((id) => getRound$(id)))

  return round$
}
