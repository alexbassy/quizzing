import Dexie, { Table } from 'dexie'
import 'dexie-observable'

export interface QuizEntry {
  id?: string
  createdAt?: number
  updatedAt?: number
  owner?: string
  name?: string
  questions?: QuestionEntry['id'][]
}

export interface QuestionEntry {
  id?: string
  createdAt?: number
  updatedAt?: number
  quizId?: string
  options?: string[]
  correctOption?: string // 0-3
  image?: string // blob?
  imageFlipped?: boolean
  imageObscurred?: boolean
}

class QuizStore extends Dexie {
  public quiz!: Table<QuizEntry, string> // id is number in this case
  public question!: Table<QuestionEntry, string> // id is number in this case

  public constructor() {
    super('QuizStore')
    this.version(1).stores({
      quiz: '$$id,name',
      question: '$$id',
    })
  }
}

export const db = new QuizStore()

// https://dexie.org/docs/Table/Table.hook('creating')
db.quiz.hook('creating', (_primaryKey, obj) => {
  obj.createdAt = Date.now()
  obj.updatedAt = Date.now()
})

// https://dexie.org/docs/Table/Table.hook('updating')
db.quiz.hook('updating', () => {
  return { updatedAt: Date.now() }
})
