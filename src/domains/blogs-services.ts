import { type BlogType } from '../types/types'
import { blogsRepository } from '../repositories/blogs-db-repository'

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
  ): Promise<BlogType | undefined> {
    const date = new Date()
    const id = `${Math.floor(Math.random() * 30)}-${date.toISOString()}`
    const newElement = {
      id: id,
      name: name,
      description: description,
      websiteUrl: websiteUrl,
      createdAt: date.toISOString(),
      isMembership: false,
    }
    const result = await blogsRepository.create(newElement)

    return newElement
  },
}
