export type BlogType = {
  id: string
  name: string
  description: string
  websiteUrl: string
  createdAt: string
  isMembership: boolean
}
export type ViewUserType = {
  id: string
  login: string
  email: string
  createdAt: string
}
export type UserDBType = {
  id: string
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
