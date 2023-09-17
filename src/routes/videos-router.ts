import { Request, Response, Router } from 'express'
import { resolutions, type VideoType } from '../db/db'

export const videosRouter = (db: VideoType[]) => {
  const router = Router()

  router.get('/', (req: Request, res: Response) => {
    const result = db.map((el) => {
      return {
        id: el.id,
        title: el.title,
        author: el.author,
        canBeDownloaded: el.canBeDownloaded,
        minAgeRestriction: el.minAgeRestriction,
        craetedAt: el.createdAt,
        publicationDate: el.publicationDate,
        availableResolutions: el.availableResolutions,
      }
    })
    console.log('20===video', result)

    res.status(200).json(result)
  })

  router.get('/:id', (req: Request, res: Response) => {
    const resId = +req.params.id

    if (!Number.isInteger(resId)) {
      res.sendStatus(404)
      return
    }
    const videoId: number = resId

    const result = db.find((el: VideoType) => el.id === videoId)
    if (result) {
      res.status(200).json(result)
    } else {
      res.sendStatus(404)
    }
  })

  router.post('/', (req: Request, res: Response) => {
    const { title, author, availableResolutions } = req.body

    // validation
    const errorsMessages = []
    if (
      !title ||
      !title.trim() ||
      typeof title !== 'string' ||
      title.length > 40
    ) {
      console.log('42====')

      const field = 'title'
      const errorObject = {
        message: `inputModel has incorrect values. Incorrect field: ${field}`,
        field,
      }
      errorsMessages.push(errorObject)
      console.log('46===video', errorsMessages)

      res.status(400).send(errorsMessages)
      return
    }

    if (!author || typeof author !== 'string' || author.length > 20) {
      const field = 'author'
      const errorObject = {
        message: `inputModel has incorrect values. Incorrect field: ${field}`,
        field,
      }
      errorsMessages.push(errorObject)
      console.log('59===video', errorsMessages)
      res.status(400).json(errorsMessages)
      return
    }

    let newAvailibleResolution = null
    if (availableResolutions && Array.isArray(availableResolutions)) {
      newAvailibleResolution = availableResolutions.filter((el: any) => {
        if (resolutions.includes(el)) {
          return el
        }
      })
    }
    if (!newAvailibleResolution) {
      const field = 'availableResolutions'
      const errorObject = {
        message: `inputModel has incorrect values. Incorrect field: ${field}`,
        field,
      }
      errorsMessages.push(errorObject)
      console.log('79===video', errorsMessages)
      res.status(400).json(errorsMessages)
      return
    }

    const newDate = new Date()
    const newNextDate = newDate
    const newCreatedDate = newDate.toISOString()
    const newPublishedDate = new Date(
      newNextDate.setDate(newNextDate.getDate() + 1)
    ).toISOString()
    const newVideo: VideoType = {
      id: +new Date(),
      title,
      author,
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: newCreatedDate,
      publicationDate: newPublishedDate,
      availableResolutions: newAvailibleResolution,
    }
    db.push(newVideo)
    res.status(201).json(newVideo)
  })

  router.put('/:id', (req: Request, res: Response) => {
    const resId = +req.params.id
    if (!Number.isInteger(resId)) {
      res.sendStatus(404)
      return
    }
    const videoId: number = resId
    const foundElement = db.find((el: VideoType) => el.id === videoId)
    if (!foundElement) {
      res.sendStatus(404)
      return
    }
    const {
      title,
      author,
      availableResolutions,
      canBeDownloaded,
      minAgeRestriction,
      publicationDate,
    } = req.body

    // validation
    const errorsMessages = []
    if (
      !title ||
      !title.trim() ||
      typeof title !== 'string' ||
      title.length > 40
    ) {
      console.log('42====')

      const field = 'title'
      const errorObject = {
        message: `inputModel has incorrect values. Incorrect field: ${field}`,
        field,
      }
      errorsMessages.push(errorObject)
      console.log('46===video', errorsMessages)

      res.status(400).send(errorsMessages)
      return
    }

    if (!author || typeof author !== 'string' || author.length > 20) {
      const field = 'author'
      const errorObject = {
        message: `inputModel has incorrect values. Incorrect field: ${field}`,
        field,
      }
      errorsMessages.push(errorObject)
      console.log('157===video', errorsMessages)
      res.status(400).json(errorsMessages)
      return
    }

    let newAvailibleResolution = null
    if (availableResolutions && Array.isArray(availableResolutions)) {
      newAvailibleResolution = availableResolutions.filter((el: any) => {
        if (resolutions.includes(el)) {
          return el
        }
      })
    }
    if (!newAvailibleResolution) {
      const field = 'availableResolutions'
      const errorObject = {
        message: `inputModel has incorrect values. Incorrect field: ${field}`,
        field,
      }
      errorsMessages.push(errorObject)
      console.log('177===video', errorsMessages)
      res.status(400).json(errorsMessages)
      return
    }

    if (canBeDownloaded && typeof canBeDownloaded !== 'boolean') {
      const field = 'canBeDownloaded'
      const errorObject = {
        message: `inputModel has incorrect values. Incorrect field: ${field}`,
        field,
      }
      errorsMessages.push(errorObject)
      console.log('201===video', errorsMessages)
      res.status(400).json(errorsMessages)
      return
    }

    if (
      minAgeRestriction &&
      typeof minAgeRestriction !== 'number' &&
      !Number.isInteger(minAgeRestriction) &&
      minAgeRestriction < 1 &&
      minAgeRestriction > 18
    ) {
      const field = 'minAgeRestriction'
      const errorObject = {
        message: `inputModel has incorrect values. Incorrect field: ${field}`,
        field,
      }
      errorsMessages.push(errorObject)
      console.log('219===video', errorsMessages)
      res.status(400).json(errorsMessages)
      return
    }

    if (
      !publicationDate ||
      typeof publicationDate !== 'string' ||
      !Number.isInteger(Date.parse(publicationDate))
    ) {
      const field = 'publicationDate'
      const errorObject = {
        message: `inputModel has incorrect values. Incorrect field: ${field}`,
        field,
      }
      errorsMessages.push(errorObject)
      console.log('234===video', errorsMessages)
      res.status(400).json(errorsMessages)
      return
    }

    const updatedVideo: VideoType = {
      id: foundElement.id,
      title,
      author,
      canBeDownloaded: canBeDownloaded ? canBeDownloaded : false,
      minAgeRestriction: minAgeRestriction ? minAgeRestriction : null,
      createdAt: foundElement?.createdAt,
      publicationDate,
      availableResolutions: newAvailibleResolution,
    }
    const index = db.indexOf(foundElement)
    db[index] = updatedVideo
    res.sendStatus(204)
  })

  router.delete('/:id', (req: Request, res: Response) => {
    const resId = +req.params.id

    if (!Number.isInteger(resId)) {
      res.sendStatus(404)
      return
    }
    const videoId: number = resId

    const result = db.find((el: VideoType) => el.id === videoId)
    if (result) {
      const index = db.indexOf(result)
      db.splice(index, 1)
      res.sendStatus(204)
    } else {
      res.sendStatus(404)
    }
  })
  return router
}
