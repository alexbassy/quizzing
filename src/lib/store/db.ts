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
  title?: string
  options?: string[]
  correctOption?: string // 0-3
  backgroundColor?: string
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
      question: '$$id,quizId',
    })
  }
}

export const db = new QuizStore()

// Add hooks for createdAt/updatedAt
// https://dexie.org/docs/Table/Table.hook('creating')
// https://dexie.org/docs/Table/Table.hook('updating')
const createHookAddCreationTime = (_primaryKey: string, obj: QuizEntry | QuestionEntry) => {
  obj.createdAt = Date.now()
  obj.updatedAt = Date.now()
}

db.quiz.hook('creating', createHookAddCreationTime)
db.question.hook('creating', createHookAddCreationTime)

const updatingHookAddUpdatedTime = () => {
  return { updatedAt: Date.now() }
}
db.quiz.hook('updating', updatingHookAddUpdatedTime)
db.question.hook('updating', updatingHookAddUpdatedTime)
