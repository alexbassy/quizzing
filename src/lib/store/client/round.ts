import { liveQuery } from 'dexie'
import { from } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import { db, RoundEntry } from '@/lib/store/db'

export function getRounds$() {
  return from(liveQuery(() => db.round.toCollection().reverse().sortBy('createdAt')))
}

export function getRound$(id: string) {
  return from(liveQuery(() => db.round.get(id)))
}

export function addRound({ quizId, players }: RoundEntry) {
  return db.round.add({ quizId, players })
}

export function getPlayersOfRound$(id: string) {
  return from(db.round.get(id)).pipe(
    switchMap((round) =>
      from(
        db.player
          .where('id')
          .anyOf(round!.players as string[])
          .toArray()
      )
    )
  )
}

export function updateQuestionReached(roundId: string, questionReached: number) {
  return db.round.update(roundId, { questionReached })
}

export function deleteRound(id: string) {
  return db.transaction('rw', db.round, db.points, async () => {
    await db.points.where({ roundId: id }).delete()
    return db.round.delete(id)
  })
}
