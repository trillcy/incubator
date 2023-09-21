import { blogsDb, type BlogType } from '../db/blogsDb'

// ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$

export const postsRepository = {
  findAll() {
    return blogsDb
  },
  findOne(id: string) {
    const result = blogsDb.find((el: BlogType) => el.id === id)
    return result
  },
  delete(id: string) {
    let foundIndex = null
    for (let index = 0; index < blogsDb.length; index++) {
      if (blogsDb[index].id === id) {
        foundIndex = index
      }
    }

    if (foundIndex !== null) {
      blogsDb.splice(foundIndex, 1)

      return true
    } else {
      return false
    }
  },
  update(id: string, name: string, description: string, websiteUrl: string) {
    let foundIndex = null
    for (let index = 0; index < blogsDb.length; index++) {
      if (blogsDb[index].id === id) {
        foundIndex = index
      }
    }
    if (foundIndex !== null) {
      const newElement = {
        id: blogsDb[foundIndex].id,
        name,
        description,
        websiteUrl,
      }
      blogsDb[foundIndex] = newElement
      return true
    } else {
      return false
    }
  },
  create(name: string, description: string, websiteUrl: string) {
    let foundIndex = null
    for (let index = 0; index < blogsDb.length; index++) {
      if (
        blogsDb[index].name === name &&
        blogsDb[index].websiteUrl === websiteUrl &&
        blogsDb[index].description === description
      ) {
        foundIndex = index
      }
    }
    if (foundIndex !== null) {
      return blogsDb[foundIndex]
    } else {
      const date = new Date()
      const id = `${blogsDb.length}-${date.toISOString()}`
      const newElement = { id, name, description, websiteUrl }
      blogsDb.push(newElement)
      return newElement
    }
  },
}
