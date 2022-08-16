import { liveQuery } from 'dexie'
import { from } from 'rxjs'
import { db, RoundEntry } from '@/lib/store/db'

export function getRounds$() {
  return from(liveQuery(() => db.round.toArray()))
}

export function getRound$(id: string) {
  return from(liveQuery(() => db.round.get(id)))
}

export function addRound({ quizId, players }: RoundEntry) {
  return db.round.add({ quizId, players })
}

export function completeRound(roundId: string) {
  return db.round.update(roundId, { completed: true })
}
