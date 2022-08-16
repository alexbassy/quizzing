import { liveQuery } from 'dexie'
import { from } from 'rxjs'
import { db, PlayerEntry } from '@/lib/store/db'

export function getPlayers$() {
  return from(liveQuery(() => db.player.toArray()))
}

export function getPlayer$(id: string) {
  return from(liveQuery(() => db.player.get(id)))
}

export function addPlayer({ name, photo, backgroundColor }: PlayerEntry) {
  return db.player.add({ name, photo, backgroundColor })
}

export function updatePlayer(playerId: string, player: PlayerEntry) {
  return db.quiz.update(playerId, player)
}

export function deletePlayer(id: string) {
  return db.transaction('rw', db.player, db.round, () => {
    db.player.delete(id)
    db.round.where('players').anyOf(id).delete()
  })
}
