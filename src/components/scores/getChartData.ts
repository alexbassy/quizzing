import { combineLatest, map, mergeMap, Observable, switchMap, take } from 'rxjs'
import { isEmpty, last } from 'radash'
import { getPlayer$, getPointsForRound$, getQuestions$, getRound$ } from '@/lib/store/client'
import { PlayerEntry, QuestionEntry } from '@/lib/store/db'

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
      points.reduce<Map<string, Map<string, number>>>((accum, point) => {
        const qId = point.questionId as string
        const pId = point.playerId as string

        if (!accum.has(qId)) accum.set(qId, new Map())
        if (!accum.get(qId)!.get(pId)) accum.get(qId)!.set(pId, 0)

        accum.get(qId)!.set(pId, accum.get(qId)!.get(pId)! + 1)

        return accum
      }, new Map())
    )
  )

  const questionsInRound$ = round$.pipe(switchMap((round) => getQuestions$(round!.quizId!)))

  return combineLatest([playersInRound$, questionsInRound$, pointsByQuestion$]).pipe(
    map(([players, questions, points]) => {
      if (isEmpty(points)) {
        return []
      }

      console.log(points)

      return (
        // make { [playerId]: [ {questionId, accumulatedPoints} ] }
        Object.entries(players).map(([playerId, player]) => {
          let accumulatedPoints = 0
          const playerScores = questions
            .map((question) => {
              const qId = question.id as string

              const didPlayQuestion = points.has(qId)
              if (!didPlayQuestion) {
                return null
              }
              const point = points.get(qId)?.get(playerId) ?? null
              if (point !== null) accumulatedPoints += point
              return {
                questionId: qId,
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
