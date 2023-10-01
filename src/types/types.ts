import { ObjectId } from 'mongodb'

export type BlogType = {
  id: string
  name: string
  description: string
  websiteUrl: string
  createdAt: string
  isMembership: boolean
}
export type ViewCommentType = {
  id: string
  content: string
  commentatorInfo: { userId: string; userLogin: string }
  createdAt: string
}
export type CommentDBType = {
  _id: ObjectId
  content: string
  commentatorInfo: { userId: string; userLogin: string }
  createdAt: string
  postId: string
}
export type ResultComment = {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
  items: ViewCommentType[]
}

export type ViewUserType = {
  id: string
  login: string
  email: string
  createdAt: string
}
export type UserDBType = {
  _id: ObjectId
  login: string
  email: string
  passwordHash: any
  passwordSalt: string
  createdAt: string
}
export type ResultUser = {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
  items: ViewUserType[]
}