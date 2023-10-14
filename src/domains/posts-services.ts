import { type ViewPostType } from '../types/types'
import { blogsCollection, db, postsCollection } from '../db/db'
import { postsRepository } from '../repositories/posts-db-repository'
import { blogsRepository } from '../repositories/blogs-db-repository'
import { ObjectId } from 'mongodb'

export const postsService = {
  async updateLikeStatus(
    userId: string,
    login: string,
    post: ViewPostType,
    likeStatus: string
  ): Promise<boolean> {
    let oldLikesCount: number = post.extendedLikesInfo.likesCount || 0
    let oldDislikesCount: number = post.extendedLikesInfo.dislikesCount || 0
    let oldStatus = post.extendedLikesInfo.myStatus || 'None'
    let newLikesCount: number = 0
    let newDislikesCount: number = 0
    console.log('19--post.serv', userId, login, likeStatus)

    switch (oldStatus) {
      case 'None': {
        newLikesCount =
          likeStatus === 'Like' ? oldLikesCount + 1 : oldLikesCount
        newDislikesCount =
          likeStatus === 'Dislike' ? oldDislikesCount + 1 : oldDislikesCount
        break
      }
      case 'Like': {
        newLikesCount =
          likeStatus === 'Like' ? oldLikesCount : oldLikesCount - 1
        newDislikesCount =
          likeStatus === 'Dislike' ? oldDislikesCount + 1 : oldDislikesCount
        break
      }
      case 'Dislike': {
        newLikesCount =
          likeStatus === 'Like' ? oldLikesCount + 1 : oldLikesCount
        newDislikesCount =
          likeStatus === 'Dislike' ? oldDislikesCount : oldDislikesCount - 1
        break
      }
    }
    const newElement = {
      likesInfo: {
        likesCount: newLikesCount,
        dislikesCount: newDislikesCount,
        myStatus: likeStatus,
      },
    }
    console.log(
      '51==posts.serv',
      post.id,
      newLikesCount,
      newDislikesCount,
      likeStatus
    )

    return await postsRepository.updateLikes(
      userId,
      login,
      post.id,
      newLikesCount,
      newDislikesCount,
      likeStatus,
      new Date()
    )
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
    const newElement = {
      _id: new ObjectId(),
      title,
      shortDescription,
      content,
      blogId,
      blogName,
      createdAt: date.toISOString(),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        statuses: [],
        newestLikes: [],
      },
    }

    const result = await postsRepository.create({ ...newElement })
    return result
  },
}
