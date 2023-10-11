import { config } from 'dotenv'
config()

import { log } from 'console'
import { MongoClient, ObjectId } from 'mongodb'
import {
  type UserDBType,
  type CommentDBType,
  type PostDBType,
  type BlogDBType,
  type DeviceDBType,
  type EffortDBType,
} from '../types/types'
import mongoose from 'mongoose'

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

const mongoURI = process.env.MONGO_URI || 'mongodb://0.0.0.0:27017'

const dbName = 'incubator'
const client = new MongoClient(mongoURI)
export const db = client.db(dbName)
const { Schema } = mongoose

const userSchema = new Schema<UserDBType>({
  _id: ObjectId,
  accountData: {
    userName: { login: String, email: String },
    passwordHash: String,
    passwordSalt: String,
    createdAt: Date,
  },
  emailConfirmation: {
    confirmationCode: String,
    expirationDate: Date,
    isConfirmed: Boolean,
  },
  deletedTokens: Array,
})
const effortSchema = new Schema<EffortDBType>({
  IP: String,
  URL: String,
  date: Date,
})
export const UserModel = mongoose.model('users', userSchema)
export const EffortModel = mongoose.model('efforts', effortSchema)
// ------
export const blogsCollection = db.collection<BlogDBType>('blogs')
export const postsCollection = db.collection<PostDBType>('posts')
// export const usersCollection = db.collection<UserDBType>('users')
export const commentsCollection = db.collection<CommentDBType>('comments')
export const devicesCollection = db.collection<DeviceDBType>('devices')
// export const effortsCollection = db.collection<EffortDBType>('efforts')

export const connectDb = async () => {
  try {
    await mongoose.connect(mongoURI)
    // await client.connect()

    // await db.command({ ping: 1 })
    log('Connected successfully to server')
  } catch (e) {
    await mongoose.disconnect()
    log({ e })
    log('cant connect to db')
  }
}

export const keys = {
  access: process.env.ACCESS_TOKEN_KEY,
  refresh: process.env.REFRESH_TOKEN_KEY,
  recovery: process.env.RECOVERY_TOKEN_KEY,
}
