import { VeryBasic } from 'unsplash-js/dist/methods/photos/types'

export interface IUnsplashSearchResult {
  id: string
  blurHash: string | null
  color: string | null
  description: string | null
  urls: VeryBasic['urls']
  credit: {
    name: string
    url: string
  }
}
