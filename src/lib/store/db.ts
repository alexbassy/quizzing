import Dexie, { Table } from 'dexie'
import 'dexie-observable'
import { exportDB } from 'dexie-export-import'

export interface QuizEntry {
  id?: string
  createdAt?: number
  updatedAt?: number
  owner?: string
  name?: string
  questions?: QuestionEntry['id'][]
}

export enum QuestionType {
  Category = 'category',
  Text = 'text',
  Image = 'image',
  Time = 'time',
  Sound = 'sound',
}

export interface QuestionEntry {
  id?: string
  createdAt?: number
  updatedAt?: number
  quizId?: QuizEntry['id']
  type?: QuestionType

  title?: string
  correctOption?: number // 0-3
  explanation?: string

  // Type = Text
  options?: string[]

  // Type = Category
  timerLengthMs?: number

  // Type = Image, TODO
  // images?: ImageEntry['id'][]

  // Type = Sound
  soundBlob?: Blob
  soundLink?: string

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
  questionReached?: number
  /**
   * @deprecated
   */
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

    // Add the type column to the question table
    this.version(2).upgrade((tx) => {
      tx.table('question')
        .toCollection()
        .modify((question) => {
          question.type = QuestionType.Text
        })
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

export async function exportDatabase(): Promise<unknown> {
  try {
    const blob = await exportDB(db, {
      // We have a lot of blobs and this makes sure that the browser tab
      // doesn’t crash and also that the resulting file is not so huge.
      numRowsPerChunk: 1,
      progressCallback: (progress) => {
        console.log('exporting', progress)
        return true
      },
    })
    return blob
  } catch (error) {
    console.log('there was an error exporting the db', error)
  }
}

export async function importDatabase(file: File): Promise<void> {
  await Dexie.import(file, {
    progressCallback: (progress) => {
      console.log('importing', progress)
      return true
    },
  })
}
