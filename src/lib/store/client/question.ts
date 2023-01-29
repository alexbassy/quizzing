import { liveQuery } from 'dexie'
import { from, Observable } from 'rxjs'
import { db, QuestionEntry } from '@/lib/store/db'

export function getQuestion$(questionId: string): Observable<QuestionEntry | undefined> {
  return from(liveQuery(() => db.question.get(questionId)))
}

export function getQuestions$(quizId: string): Observable<QuestionEntry[]> {
  return from(
    liveQuery(async () => {
      const [quiz, questions] = await Promise.all([
        db.quiz.get(quizId),
        db.question.where({ quizId }).toArray(),
      ])
      const questionsById = Object.fromEntries(questions.map((question) => [question.id, question]))
      return (quiz?.questions || []).map((id) => questionsById[id!])
    })
  )
}

export async function addQuestion({ quizId, ...rest }: Partial<QuestionEntry> = {}) {
  if (!quizId) throw new Error('`quizId` is required')
  const nQ = await db.question.add({ quizId, ...rest })
  return db.transaction('rw', db.quiz, async () => {
    const quiz = await db.quiz.get(quizId)
    const newQuestions = [...(quiz?.questions || []), nQ]
    await db.quiz.update(quizId, { questions: newQuestions })
    return nQ
  })
}

export async function deleteQuestion(quizId: string, questionId: string) {
  return db.transaction('rw', db.quiz, db.question, async () => {
    const removeQuestionFromQuiz = db.quiz.get(quizId).then((quiz) =>
      quiz
        ? db.quiz.update(quiz, {
            questions: quiz?.questions?.filter((id) => id !== questionId) ?? [],
          })
        : null
    )
    return Promise.all([removeQuestionFromQuiz, db.question.delete(questionId)])
  })
}

export function updateQuestionTitle(questionId: string, title: string) {
  return db.question.update(questionId, { title })
}

export async function updateQuestionOption(questionId: string, index: number, value: string) {
  return db.transaction('rw', db.question, async () => {
    const question = await db.question.get(questionId)
    if (!question) return
    const options = question.options || []
    const newOptions = Array.from({ length: 4 }).map((_, i) => options[i])
    newOptions[index] = value
    await db.question.update(question, { options: newOptions })
  })
}

export async function updateQuestionCorrectOption(questionId: string, optionIndex: number) {
  return db.question.update(questionId, { correctOption: optionIndex })
}

export async function updateQuestionImage(questionId: string, image?: Blob, thumbnail?: Blob) {
  return db.question.update(questionId, { image, thumbnail })
}
