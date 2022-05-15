export type RoundState = Record<string, number>
export type ScoresState = Record<string, RoundState>

const CACHE_KEY = 'scores'

export function saveScoresToCache(scores: ScoresState): void {
  localStorage.setItem(CACHE_KEY, JSON.stringify(scores))
}

export function getScoresFromCache(): ScoresState {
  try {
    const result = JSON.parse(localStorage.getItem(CACHE_KEY) || '')
    if (result && Object.keys(result).length) {
      return result as ScoresState
    }
    return {}
  } catch (e) {
    return {}
  }
}
