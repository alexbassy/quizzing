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
  return db.quiz.add({ name: 'New Quiz' })
}

export function updateQuizTitle(quizId: string, newName: string) {
  return db.quiz.update(quizId, { name: newName })
}

export async function getQuestionIndex(quizId: string, questionId: string) {
  const quiz = await db.quiz.get(quizId)
  if (!quiz || !quiz.questions) return -1
  return quiz.questions.findIndex((id) => id === questionId)
}

export async function getQuestionIdByIndex(quizId: string, index: number): Promise<string | null> {
  const quiz = await db.quiz.get(quizId)
  if (!quiz || !quiz.questions || !quiz.questions.length) return null
  return quiz.questions[index] as string
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
