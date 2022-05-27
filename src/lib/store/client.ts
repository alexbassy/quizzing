import { liveQuery } from 'dexie'
import { from, Observable } from 'rxjs'
import { db, QuizEntry } from './db'

export function quizzes$() {
  return from(liveQuery(() => db.quiz.toArray()))
}

export function addQuiz() {
  return from(db.quiz.add({ name: 'Untitled' }))
}
