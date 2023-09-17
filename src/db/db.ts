export type VideoType = {
  id: number
  title: string
  author: string
  canBeDownloaded: boolean
  minAgeRestriction: any | null
  createdAt?: string
  publicationDate: string
  availableResolutions: any
}
export const resolutions = [
  'P144',
  'P240',
  'P360',
  'P480',
  'P720',
  'P1080',
  'P1440',
  'P2160',
]

export enum Resolution {
  P144 = 'P144',
  P240 = 'P240',
  P360 = 'P360',
  P480 = 'P480',
  P720 = 'P720',
  P1080 = 'P1080',
  P1440 = 'P1440',
  P2160 = 'P2160',
}

export const db: VideoType[] = []
