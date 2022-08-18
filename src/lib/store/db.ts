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

export interface RoundEntry {
  id?: string
  quizId?: string
  players?: PlayerEntry['id'][]
  createdAt?: number
  completed?: boolean
}

// When a player scores a point on a round, an entry is created in this table.
// When showing the question, this table is queried to find scores.
export interface PointEntry {
  id?: number
  roundId?: RoundEntry['id']
  playerId?: PlayerEntry['id']
  questionId?: QuestionEntry['id']
}

class QuizStore extends Dexie {
  public quiz!: Table<QuizEntry, string>
  public question!: Table<QuestionEntry, string>
  public player!: Table<PlayerEntry, string>
  public round!: Table<RoundEntry, string>
  public points!: Table<PointEntry, string>

  public constructor() {
    super('QuizStore')
    this.version(1).stores({
      quiz: '$$id, name',
      question: '$$id, quizId',
      player: '$$id, name',
      round: '$$id, quizId',
      points: '++id, [roundId+questionId]',
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
db.round.hook('creating', createHookAddCreationTime)

const updatingHookAddUpdatedTime = () => {
  return { updatedAt: Date.now() }
}

db.quiz.hook('updating', updatingHookAddUpdatedTime)
db.question.hook('updating', updatingHookAddUpdatedTime)
