import { log } from 'console'
import { MongoClient } from 'mongodb'
import { BlogType } from './blogsDb'
import { PostType } from './postsDb'

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

export const videoDb: VideoType[] = []

const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'

const dbName = 'incubator'
const client = new MongoClient(mongoURI)
export const db = client.db(dbName)

export const blogsCollection = db.collection<BlogType>('blogs')
export const postsCollection = db.collection<PostType>('posts')

export const connectDb = async () => {
  try {
    console.log('46----', mongoURI)

    await client.connect()
    console.log('49------123')

    await db.command({ ping: 1 })
    console.log('Connected successfully to server')
  } catch (e) {
    log({ e })
    log('cant connect to db')
  }
}
