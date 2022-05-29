import { liveQuery } from 'dexie'
import { from, map } from 'rxjs'
import { db, QuestionEntry } from './db'

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

export async function deleteQuiz(id: string) {
  db.transaction('rw', db.quiz, db.question, async () => {
    await db.question.where({ quizId: id }).modify((_value, ref) => {
      // @ts-ignore
      delete ref.value
    })
    return db.quiz.delete(id)
  })
}

export function getQuestions$(quizId: string) {
  return from(liveQuery(() => db.question.where({ quizId }).toArray()))
}

export async function addQuestion({ quizId, ...rest }: Partial<QuestionEntry> = {}) {
  if (!quizId) throw new Error('`quizId` is required')
  const nQ = await db.question.add({ quizId, ...rest })
  db.transaction('rw', db.quiz, async () => {
    const quiz = await db.quiz.get(quizId)
    const newQuestions = [...(quiz?.questions || []), nQ]
    await db.quiz.update(quizId, { questions: newQuestions })
    return nQ
  })
}
