import { ObjectId } from 'mongodb'

export type EffortDBType = {
  _id: ObjectId
  IP: string
  URL: string
  date: Date
}

export type ViewDeviceType = {
  ip: string
  title: string
  deviceId: string
  lastActiveDate: string
}

export type DeviceDBType = {
  _id: ObjectId
  ip: string
  title: string
  deviceId: string
  lastActiveDate: Date
  userId: string
}

export type EmailBody = {
  email: string
  message: string
  subject: string
}

export type PostDBType = {
  _id: ObjectId
  title: string
  shortDescription: string
  content: string
  blogId: string
  blogName: string
  createdAt: string
  extendedLikesInfo: {
    likesCount: number
    dislikesCount: number
    statuses: { addedAt: Date; userId: string; status: string; login: string }[]
    // newestLikes: { addedAt: string; userId: string; login: string }[]
  }
}
export type ViewPostType = {
  id: string
  title: string
  shortDescription: string
  content: string
  blogId: string
  blogName: string
  createdAt: string
  extendedLikesInfo: {
    likesCount: number
    dislikesCount: number
    myStatus: string
    newestLikes: { addedAt: string; userId: string; login: string }[]
  }
}

export type BlogDBType = {
  _id: ObjectId
  name: string
  description: string
  websiteUrl: string
  createdAt: string
  isMembership: boolean
}
export type ViewBlogType = {
  id: string
  name: string
  description: string
  websiteUrl: string
  createdAt: string
  isMembership: boolean
}
export type ResultBlog = {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
  items: ViewBlogType[]
}
export type ViewCommentType = {
  id: string
  content: string
  commentatorInfo: { userId: string; userLogin: string }
  createdAt: string
  likesInfo: { likesCount: number; dislikesCount: number; myStatus: string }
}
export type CommentDBType = {
  _id: ObjectId
  content: string
  commentatorInfo: { userId: string; userLogin: string }
  createdAt: string
  postId: string
  likesInfo: {
    likesCount: number
    dislikesCount: number
    statuses: { userId: string; status: string }[]
  }
}
export type ResultComment = {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
  items: ViewCommentType[]
}

export type ViewCompleteUserType = {
  id: string
  accountData: {
    userName: { login: string; email: string }
    passwordHash: string
    createdAt: Date
  }
  emailConfirmation: {
    confirmationCode: string | null
    expirationDate: Date | null
    isConfirmed: boolean
  }
  passwordConfirmation: {
    confirmationCode: string | null
    expirationDate: Date | null
    isConfirmed: boolean
  }
  deletedTokens: string[]
}
export type UserDBType = {
  _id: ObjectId
  accountData: {
    userName: { login: string; email: string }
    passwordHash: any
    passwordSalt: string
    createdAt: Date
  }
  emailConfirmation: {
    confirmationCode: string | null
    expirationDate: Date | null
    isConfirmed: boolean
  }
  passwordConfirmation: {
    confirmationCode: string | null
    expirationDate: Date | null
    isConfirmed: boolean
  }
  deletedTokens: string[]
}
export type ViewEmailUserType = {
  id: string
  login: string
  email: string
  createdAt: string
  confirmationCode: string | null
  expirationDate: Date | null
  isConfirmed: boolean
}
export type ViewUserType = {
  id: string
  login: string
  email: string
  createdAt: string
}
/*
export type UserDBType = {
  _id: ObjectId
  login: string
  email: string
  passwordHash: any
  passwordSalt: string
  createdAt: string
}
*/
export type ResultUser = {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
  items: ViewUserType[]
}
