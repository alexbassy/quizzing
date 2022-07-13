import { liveQuery } from 'dexie'
import { from, map } from 'rxjs'
import { db } from '@/lib/store/db'

export function getQuizzes$() {
  return from(liveQuery(() => db.quiz.toArray())).pipe(
    map((quizzes) => quizzes.sort((a, b) => b.updatedAt! - a.updatedAt!))
  )
}

export function getQuiz$(id: string) {
  return from(liveQuery(() => db.quiz.get(id)))
}

export function addQuiz() {
  return db.quiz.add({ name: 'Untitled' })
}

export function updateQuizTitle(quizId: string, newName: string) {
  return db.quiz.update(quizId, { name: newName })
}

export function deleteQuiz(id: string) {
  return db.transaction('rw', db.quiz, db.question, async () => {
    await db.question.where({ quizId: id }).modify((_value, ref) => {
      // @ts-ignore
      delete ref.value
    })
    return db.quiz.delete(id)
  })
}
