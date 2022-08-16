import { liveQuery } from 'dexie'
import { from } from 'rxjs'
import { db, PointEntry } from '@/lib/store/db'

export function addPoint({ questionId, roundId, playerId }: PointEntry) {
  return db.points.add({ questionId, roundId, playerId })
}

export function getPoints$(roundId: string, questionId: string) {
  return from(liveQuery(() => db.points.where({ roundId, questionId }).toArray()))
}
