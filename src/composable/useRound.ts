import { switchMap } from 'rxjs/operators'
import { useRoute } from 'vue-router'
import { getRound$ } from '@/lib/store/client'
import { watch$ } from '@/lib/observables'

export default function useRound$() {
  const route = useRoute()
  const roundId$ = watch$(() => route.params.roundId as string)
  const round$ = roundId$.pipe(switchMap((id) => getRound$(id)))

  return round$
}
