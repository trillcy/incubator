import { postsDb, type PostType, type ResultPost } from '../db/postsDb'
import { type ViewBlogType, PostDBType, ViewPostType } from '../types/types'
import { postsCollection } from '../db/db'
import { blogsRepository } from './blogs-db-repository'
import { ObjectId } from 'mongodb'

const postsFields = [
  'id',
  'title',
  'shortDescription',
  'content',
  'blogId',
  'blogName',
]

const postsDirections = ['asc', 'desc']

export const postsRepository = {
  async updateLikes(
    userId: string,
    login: string,
    id: string,
    newLikesCount: number,
    newDislikesCount: number,
    likeStatus: string,
    addedAt: Date
  ): Promise<boolean> {
    const post = await postsCollection.findOne({ _id: new ObjectId(id) })
    console.log('29++post.repo-post', post)

    if (!post) return false
    const foundStatus = post.extendedLikesInfo.statuses.find(
      (el) => el.userId === userId
    )
    let index = post.extendedLikesInfo.statuses.length
    if (foundStatus) {
      index = post.extendedLikesInfo.statuses.indexOf(foundStatus)
    }
    let newPost = { ...post }
    newPost.extendedLikesInfo.statuses[index] = {
      addedAt,
      userId,
      login,
      status: likeStatus,
    }
    newPost.extendedLikesInfo.likesCount = newLikesCount
    newPost.extendedLikesInfo.dislikesCount = newDislikesCount
    const result = await postsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: { ...newPost },
      }
    )

    if (result.matchedCount === 1) {
      return true
    } else {
      return false
    }
  },

  async findAll(
    userId: string | null,
    sortBy: string | undefined,
    sortDirection: string | undefined,
    pageNumber: string | undefined,
    pageSize: string | undefined,
    blogId?: string | undefined
  ): Promise<ResultPost> {
    // -----
    const sortField =
      sortBy && postsFields.includes(sortBy) ? sortBy : 'createdAt'
    const sortString =
      sortDirection && postsDirections.includes(sortDirection)
        ? sortDirection
        : 'desc'
    const sortValue = sortString === 'desc' ? -1 : 1
    const sortObject: any = {}
    sortObject[sortField] = sortValue
    // ------
    const numberOfPage =
      pageNumber && Number.isInteger(+pageNumber) ? +pageNumber : 1
    const size = pageSize && Number.isInteger(+pageSize) ? +pageSize : 10
    const skipElements = (numberOfPage - 1) * size
    // -----

    const searchObject = blogId ? { blogId: blogId } : {}
    // ---------
    const items = await postsCollection
      .find(searchObject) //, { projection: { _id: 0 } })
      .sort(sortObject)
      .skip(skipElements)
      .limit(size)
      .toArray()

    const totalCount = await postsCollection.countDocuments(searchObject)
    const pagesCount = Math.ceil(totalCount / size)
    const array: ViewPostType[] = items.map((item) => {
      // определяем статус для конкретного поста
      let userStatus = 'None'

      if (userId) {
        const array = item.extendedLikesInfo.statuses.filter(
          (el) => el.userId === userId
        )
        userStatus = array.length ? array[0].status : 'None'
      }

      // находим первые три элемента по дате
      const filteredLikes = item.extendedLikesInfo.statuses.filter(
        (el) => el.status === 'Like'
      )

      const sortedLikes = filteredLikes.sort(
        (a, b) => b.addedAt.getTime() - a.addedAt.getTime()
      )

      const newestLikes = sortedLikes.slice(0, 3).map((el) => {
        return {
          addedAt: el.addedAt.toISOString(),
          userId: el.userId,
          login: el.login,
        }
      })

      return {
        id: item._id.toString(),
        title: item.title,
        shortDescription: item.shortDescription,
        content: item.content,
        blogId: item.blogId,
        blogName: item.blogName,
        createdAt: item.createdAt,
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: userStatus,
          newestLikes: newestLikes,
        },
      }
    })
    // resultArray.push(object)
    // } else {
    //   return null
    // }
    // }
    const result: ResultPost = {
      pagesCount,
      page: numberOfPage,
      pageSize: size,
      totalCount,
      items: array,
    }
    return result
  },

  async findById(
    userId: string | null,
    id: string
  ): Promise<ViewPostType | null> {
    console.log('161++post.repo-userId,id', userId, id)

    const result = await postsCollection.findOne({ _id: new ObjectId(id) })
    console.log('164++post.repo-result', result)
    if (result) {
      let userStatus = 'None'

      if (userId) {
        const array = result.extendedLikesInfo.statuses.filter(
          (el) => el.userId === userId
        )
        userStatus = array.length ? array[0].status : 'None'
      }

      // находим первые три элемента по дате
      const sortedLikes = result.extendedLikesInfo.statuses.sort(
        (a, b) => b.addedAt.getTime() - a.addedAt.getTime()
      )
      const newestLikes = sortedLikes.slice(0, 3).map((el) => {
        return {
          addedAt: el.addedAt.toISOString(),
          userId: el.userId,
          login: el.login,
        }
      })
      // return result
      // ====
      return {
        id: result._id.toString(),
        title: result.title,
        shortDescription: result.shortDescription,
        content: result.content,
        blogId: result.blogId,
        blogName: result.blogName,
        createdAt: result.createdAt,
        extendedLikesInfo: {
          likesCount: result.extendedLikesInfo.likesCount,
          dislikesCount: result.extendedLikesInfo.dislikesCount,
          myStatus: userStatus,
          newestLikes,
        },
      }
      // =====
    } else {
      return null
    }
  },

  async deleteAll(): Promise<boolean> {
    const result = await postsCollection.deleteMany({})
    const totalCount = await postsCollection.countDocuments({})
    return totalCount === 0
  },

  async delete(id: string): Promise<boolean> {
    const result = await postsCollection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount === 1
  },

  async update(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
  ): Promise<boolean> {
    const result = await postsCollection.updateOne(
      { _id: new ObjectId(id) },
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

  async create(newElement: PostDBType): Promise<ViewPostType | null> {
    const result = await postsCollection.insertOne({ ...newElement })
    if (result.acknowledged) {
      return {
        id: result.insertedId.toString(),
        title: newElement.title,
        shortDescription: newElement.shortDescription,
        content: newElement.content,
        blogId: newElement.blogId,
        blogName: newElement.blogName,
        createdAt: newElement.createdAt,
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [],
        },
      }
    } else {
      return null
    }
  },
}
