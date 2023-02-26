import { combineLatest, map, mergeMap, Observable, switchMap, take } from 'rxjs'
import { isEmpty, last } from 'radash'
import { getPlayer$, getPointsForRound$, getQuestions$, getRound$ } from '@/lib/store/client'
import { PlayerEntry, QuestionEntry } from '@/lib/store/db'
import { RoundEntry } from './../../lib/store/db'

export interface ScoreDataPoint {
  questionId: string
  title: string
  point: number
  score: number
}

export interface ScoresData {
  series: string // player id
  player: PlayerEntry
  score: number
  data: ScoreDataPoint[]
  questions: QuestionEntry[]
}

export default function getChartData(roundId: string): Observable<ScoresData[]> {
  const round$ = getRound$(roundId)

  const playersInRound$ = round$.pipe(
    map((round) => round!.players!.map((id) => getPlayer$(id!))),
    mergeMap((players) => combineLatest(players)),
    map((players) => Object.fromEntries(players.map((player) => [player!.id as string, player])))
  )

  const pointsByQuestion$ = round$.pipe(
    switchMap((round) => getPointsForRound$(round!.id!)),
    map((points) =>
      points.reduce<Record<string, Record<string, number>>>((accum, point) => {
        if (!accum[point.questionId!]) accum[point.questionId!] = {}
        if (!accum[point.questionId!][point.playerId!]) accum[point.questionId!][point.playerId!] = 0
        accum[point.questionId!][point.playerId!]++
        return accum
      }, {})
    )
  )

  const questionsInRound$ = round$.pipe(switchMap((round) => getQuestions$(round!.quizId!)))

  return combineLatest([playersInRound$, questionsInRound$, pointsByQuestion$]).pipe(
    map(([players, questions, points]) => {
      if (isEmpty(points)) {
        return []
      }

      return (
        // make { [playerId]: [ {questionId, accumulatedPoints} ] }
        Object.entries(players).map(([playerId, player]) => {
          let accumulatedPoints = 0
          const playerScores = questions
            .map((question) => {
              const questionId = question.id as string
              const didPlayQuestion = Boolean(points?.[questionId])
              if (!didPlayQuestion) {
                return null
              }
              const point = points?.[questionId]?.[playerId] ?? null
              if (point !== null) accumulatedPoints += point
              return {
                questionId: questionId,
                title: question.title,
                point,
                score: accumulatedPoints,
              }
            })
            .filter(Boolean)

          return {
            series: playerId,
            player,
            score: last(playerScores || [{}])?.score ?? 0,
            data: playerScores,
          }
        }) as ScoresData[]
      )
    }),
    take(1)
  )
}
