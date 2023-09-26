import { log } from 'console'
import { blogsDb, type BlogType } from '../db/blogsDb'
import { blogsCoollection } from '../db/db'

export const blogsRepository = {
  async deleteAll(): Promise<boolean> {
    await blogsCoollection.deleteMany({})
    const totalCount = await blogsCoollection.countDocuments({})
    return totalCount === 0
  },

  async findAll(): Promise<BlogType[] | undefined> {
    const result = await blogsCoollection
      .find({}, { projection: { _id: 0 } })
      .toArray()
    if (result) {
      return result
    } else {
      return undefined
    }
  },

  async findById(id: string): Promise<BlogType | null> {
    return await blogsCoollection.findOne(
      { id: id },
      { projection: { _id: 0 } }
    )
  },
  async delete(id: string): Promise<boolean> {
    const result = await blogsCoollection.deleteOne({ id: id })
    return result.deletedCount === 1
  },
  async update(
    id: string,
    name: string,
    description: string,
    websiteUrl: string
  ): Promise<boolean> {
    const result = await blogsCoollection.updateOne(
      { id: id },
      {
        $set: {
          name: name,
          description: description,
          websiteUrl: websiteUrl,
        },
      }
    )
    if (result.matchedCount === 1) {
      return true
    } else {
      return false
    }
  },
  async create(
    name: string,
    description: string,
    websiteUrl: string
  ): Promise<BlogType | undefined> {
    const date = new Date()
    const id = `${blogsDb.length}-${date.toISOString()}`
    const newElement = {
      id: id,
      name: name,
      description: description,
      websiteUrl: websiteUrl,
      createdAt: date.toISOString(),
      isMembership: false,
    }
    await blogsCoollection.insertOne({ ...newElement })
    return newElement
  },
}
