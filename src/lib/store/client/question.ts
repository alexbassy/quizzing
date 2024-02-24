import { liveQuery } from 'dexie'
import { from, map, Observable } from 'rxjs'
import randomColor from 'randomcolor'
import { db, QuestionEntry, QuestionType } from '@/lib/store/db'

export function getQuestion$(questionId: string): Observable<QuestionEntry | undefined> {
  return from(liveQuery(() => db.question.get(questionId)))
}

// Get ordered list of questions
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

export function getPlayableQuestions$(quizId: string): Observable<QuestionEntry[]> {
  return getQuestions$(quizId).pipe(
    map((questions) => questions.filter((q) => q.type !== QuestionType.Category))
  )
}

// Get the question ids of the quiz that are not categories
export function getPlayableQuestionIds$(quizId: string): Observable<string[]> {
  return from(
    liveQuery(async () => {
      // Get ordered list of question IDs
      const quizQuestions = (await db.quiz
        .get(quizId)
        .then((quiz) => quiz?.questions?.filter(Boolean) || [])) as string[]
      // Get playable questions
      const playableQuestions = await db.question
        .where({ quizId })
        .filter((question) => question.type !== QuestionType.Category)
        .toArray()
      // Return ordered list of question IDs that are playable
      return quizQuestions.filter((id) => playableQuestions.some((q) => q.id === id))
    })
  )
}

export async function addQuestion({ quizId, ...rest }: Partial<QuestionEntry> = {}) {
  if (!quizId) throw new Error('`quizId` is required')
  const nQ = await db.question.add({
    quizId,
    backgroundColor: randomColor({ luminosity: 'dark' }),
    ...rest,
  })
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

export async function moveQuestion(quizId: string, questionId: string, targetQuestionId: string) {
  return db.transaction('rw', db.quiz, async () => {
    const quiz = await db.quiz.get(quizId)
    if (!quiz) return
    const questions = [...(quiz.questions || [])]
    const fromIndex = questions.indexOf(questionId)
    if (fromIndex === -1) return
    questions.splice(fromIndex, 1)
    const toIndex = questions.indexOf(targetQuestionId)
    questions.splice(toIndex, 0, questionId)
    await db.quiz.update(quiz, { questions })
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

export async function updateQuestionExplanation(questionId: string, value: string) {
  return db.question.update(questionId, { explanation: value })
}

export async function updateQuestionCorrectOption(questionId: string, optionIndex: number) {
  return db.question.update(questionId, { correctOption: optionIndex })
}

export async function updateQuestionImage(questionId: string, image?: Blob, thumbnail?: Blob) {
  return db.question.update(questionId, { image, thumbnail })
}
