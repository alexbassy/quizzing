import { liveQuery } from 'dexie'
import { from, map, Observable } from 'rxjs'
import { db, QuizEntry } from './db'

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

export function deleteQuiz(id: string) {
  return db.quiz.delete(id)
}

export function getQuestions$(quizId: string) {
  return from(liveQuery(() => db.question.where({ quizId }).toArray()))
}

export async function addQuestion(quizId: string) {
  const nQ = await db.question.add({ title: 'Title', quizId })
  console.log('Made question', nQ)
  db.transaction('rw', db.quiz, async () => {
    const quiz = await db.quiz.get(quizId)
    console.log('Got quiz', quiz)
    const newQuestions = [...(quiz?.questions || []), nQ]
    await db.quiz.update(quizId, { questions: newQuestions })
    return nQ
  })
}
