export type PostType = {
  id: string
  title: string
  shortDescription: string
  content: string
  blogId: string
  createdAt: string
}

export type ViewPostType = {
  id: string
  title: string
  shortDescription: string
  content: string
  blogId: string
  blogName: string
  createdAt: string
}

export type ResultPost = {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
  items: ViewPostType[]
}

export const postsDb: PostType[] = []
