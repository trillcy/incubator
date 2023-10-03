import { type ViewBlogType } from '../types/types'
import { blogsRepository } from '../repositories/blogs-db-repository'
import { ObjectId } from 'mongodb'

export const blogsService = {
  async delete(id: string): Promise<boolean> {
    return await blogsRepository.delete(id)
  },
  async update(
    id: string,
    name: string,
    description: string,
    websiteUrl: string
  ): Promise<boolean> {
    return await blogsRepository.update(id, name, description, websiteUrl)
  },

  async create(
    name: string,
    description: string,
    websiteUrl: string
  ): Promise<ViewBlogType | null> {
    const date = new Date()
    // const id = `${Math.floor(Math.random() * 30)}-${date.toISOString()}`
    const newElement = {
      _id: new ObjectId(),
      name: name,
      description: description,
      websiteUrl: websiteUrl,
      createdAt: date.toISOString(),
      isMembership: false,
    }
    const result = await blogsRepository.create(newElement)

    return result
  },
}
