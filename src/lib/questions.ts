import { nanoid } from 'nanoid'
import allQuestions from './questions.json'
import allPlayers from './players.json'

const questions = allQuestions.questions as IQuestion[]
const players: IPlayer[] = allPlayers.people

export interface IQuestionOption {
  id?: string
  text: string
  correct?: boolean
}

export interface IQuestionImage {
  url: string
  flip?: boolean
  obscured?: boolean
}

export interface IQuestion {
  id?: string
  count?: number
  title: string
  options: IQuestionOption[]
  image: IQuestionImage
}

export interface IPlayer {
  name: string
  score: number
  image: string
}

// Add unique IDs for easy use inside React lists
export const questionsWithIDs = questions.map((question, i) => ({
  ...question,
  id: nanoid(),
  count: i + 1,
  options: question.options.map((option) => ({
    ...option,
    id: nanoid(),
    correct: Boolean(option.correct),
  })),
  image: {
    id: nanoid(),
    ...question.image,
    flip: Boolean(question.image.flip),
    obscured: Boolean(question.image.obscured),
  },
}))

const playersWithIDs = players.map((player, i) => ({
  ...player,
  id: nanoid(),
}))

export { questionsWithIDs as questions, playersWithIDs as players }
