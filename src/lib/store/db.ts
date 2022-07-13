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
  correctOption?: number // 0-3
  backgroundColor?: string
  image?: Blob
  thumbnailImage?: Blob
  imageFlipped?: boolean
  imageObscurred?: boolean
}

export interface PlayerEntry {
  id?: string
  name?: string
  photo?: Blob
  backgroundColor?: string
}

export interface ScoresEntry {
  id?: string
  quizId?: string
  players?: PlayerEntry['id'][]
}

class QuizStore extends Dexie {
  public quiz!: Table<QuizEntry, string>
  public question!: Table<QuestionEntry, string>
  public player!: Table<PlayerEntry, string>
  public scores!: Table<ScoresEntry, string>

  public constructor() {
    super('QuizStore')
    this.version(1).stores({
      quiz: '$$id,name',
      question: '$$id,quizId',
      player: '$$id,name',
      scores: '$$id,quizId',
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
