import { postsDb, type PostType } from '../db/postsDb'
import { blogsCoollection, db, postsCoollection } from '../db/db'

export const postsRepository = {
  async findAll(): Promise<PostType[] | undefined> {
    console.log('6++++')

    const result = await postsCoollection
      .find({}, { projection: { _id: 0 } })
      .toArray()
    console.log('9+++post-rep', result)

    if (result) {
      return result
    } else {
      return undefined
    }
  },

  async findById(id: string): Promise<PostType | null> {
    const result = await postsCoollection.findOne(
      { id: id },
      { projection: { _id: 0 } }
    )
    if (result) {
      return result
    } else {
      return null
    }
  },

  async deleteAll(): Promise<boolean> {
    const result = await postsCoollection.deleteMany({})
    const totalCount = await postsCoollection.countDocuments({})
    return totalCount === 0
  },

  async delete(id: string): Promise<boolean> {
    const result = await postsCoollection.deleteOne({ id: id })
    return result.deletedCount === 1
  },

  async update(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
  ): Promise<boolean> {
    const result = await postsCoollection.updateOne(
      { id: id },
      {
        $set: {
          title: title,
          shortDescription: shortDescription,
          content: content,
          blogId: blogId,
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
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
  ): Promise<PostType | undefined> {
    console.log('60+++post-repo')
    // const blog = await blogsCoollection.findOne(
    //   { id: blogId },
    //   { projection: { _id: 0 } }
    // )

    const date = new Date()
    const id = `${postsDb.length}-${date.toISOString()}`
    const newElement = {
      id,
      title,
      shortDescription,
      content,
      blogId,
      // blogName: blog!.name,
      createdAt: date.toISOString(),
    }
    const result = await db
      .collection<PostType>('posts')
      .insertOne({ ...newElement })

    return newElement
    // }
  },
}
