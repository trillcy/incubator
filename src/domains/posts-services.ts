import {
  postsDb,
  type PostType,
  type ViewPostType,
  type ResultPost,
} from '../db/postsDb'
import { blogsCollection, db, postsCollection } from '../db/db'
import { postsRepository } from '../repositories/posts-db-repository'
import { blogsRepository } from '../repositories/blogs-db-repository'

export const postsService = {
  async findAll(
    // searchNameTerm: string | undefined,
    sortBy: string | undefined,
    sortDirection: string | undefined,
    pageNumber: string | undefined,
    pageSize: string | undefined
  ): Promise<ResultPost | null> {
    return await postsRepository.findAll(
      // searchNameTerm,
      sortBy,
      sortDirection,
      pageNumber,
      pageSize
    )
  },

  async findById(id: string): Promise<PostType | null> {
    return await postsRepository.findById(id)
  },

  async deleteAll(): Promise<boolean> {
    return await postsRepository.deleteAll()
  },

  async delete(id: string): Promise<boolean> {
    return await postsRepository.delete(id)
  },

  async update(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
  ): Promise<boolean> {
    const blogModel = await blogsRepository.findById(blogId)
    if (!blogModel) {
      return false
    }

    return await postsRepository.update(
      id,
      title,
      shortDescription,
      content,
      blogId
    )
  },

  async create(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
  ): Promise<ViewPostType | null> {
    const blogModel = await blogsRepository.findById(blogId)
    if (!blogModel) return null
    const blogName = blogModel.name

    const date = new Date()
    const id = `${postsDb.length}-${date.toISOString()}`
    const newElement = {
      id,
      title,
      shortDescription,
      content,
      blogId,
      blogName,
      createdAt: date.toISOString(),
    }

    const result = await postsRepository.create({ ...newElement })
    if (result) {
      return newElement
    } else {
      return null
    }
  },
}
