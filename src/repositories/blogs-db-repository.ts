import { type BlogType } from '../db/types'
import { blogsCollection } from '../db/db'

const blogsFields = [
  'id',
  'name',
  'description',
  'websiteUrl',
  'createdAt',
  'isMembership',
]

const blogsDirections = ['asc', 'desc']

export const blogsRepository = {
  async deleteAll(): Promise<boolean> {
    await blogsCollection.deleteMany({})
    const totalCount = await blogsCollection.countDocuments({})
    return totalCount === 0
  },

  async findAll(
    searchNameTerm: string | undefined,
    sortBy: string | undefined,
    sortDirection: string | undefined,
    pageNumber: string | undefined,
    pageSize: string | undefined
  ): Promise<any> {
    //Promise<BlogType[] | undefined> {

    const searchName = searchNameTerm ? searchNameTerm : ''
    // -----
    const sortField =
      sortBy && blogsFields.includes(sortBy) ? sortBy : 'createdAt'
    const sortString =
      sortDirection && blogsDirections.includes(sortDirection)
        ? sortDirection
        : 'desc'
    const sortValue = sortString === 'desc' ? -1 : 1
    const sortObject: any = {}
    sortObject[sortField] = sortValue
    // ------
    // TODO: проверить общее количество элементов в коллекции
    // если меньше, то поставить соответствующий skipElements
    // ------
    const numberOfPage =
      pageNumber && Number.isInteger(+pageNumber) ? +pageNumber : 1
    const size = pageSize && Number.isInteger(+pageSize) ? +pageSize : 10
    const skipElements = (numberOfPage - 1) * size

    const items = await blogsCollection
      .find(
        { name: { $regex: searchName, $options: 'i' } },
        { projection: { _id: 0 } }
      )
      .sort(sortObject)
      .skip(skipElements)
      .limit(size)
      .toArray()
    const totalCount = await blogsCollection.countDocuments({
      name: { $regex: searchName, $options: 'i' },
    })
    const pagesCount = Math.ceil(totalCount / size)
    if (items) {
      const result = {
        pagesCount,
        page: numberOfPage,
        pageSize: size,
        totalCount,
        items,
      }
      return result
    } else {
      return undefined
    }
  },

  async findById(id: string): Promise<BlogType | null> {
    return await blogsCollection.findOne({ id: id }, { projection: { _id: 0 } })
  },
  async delete(id: string): Promise<boolean> {
    const result = await blogsCollection.deleteOne({ id: id })

    return result.deletedCount === 1
  },
  async update(
    id: string,
    name: string,
    description: string,
    websiteUrl: string
  ): Promise<boolean> {
    const result = await blogsCollection.updateOne(
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
  async create(newElement: BlogType): Promise<BlogType | undefined> {
    await blogsCollection.insertOne({ ...newElement })
    return newElement
  },
}
