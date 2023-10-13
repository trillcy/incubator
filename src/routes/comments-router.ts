import { Request, Response, Router, query } from 'express'
import { blogsRepository } from '../repositories/blogs-db-repository'
import {
  ValidationError,
  body,
  param,
  validationResult,
} from 'express-validator'
import { postsRepository } from '../repositories/posts-db-repository'
import { blogsService } from '../domains/blogs-services'
import { validationMiidleware } from '../middlewares/validation'
import { postsService } from '../domains/posts-services'
import { ResultPost, ViewPostType } from '../db/postsDb'
import { usersService } from '../domains/users-services'
import { usersRepository } from '../repositories/users-db-repository'
import { ResultUser, ViewUserType } from '../types/types'
import { authMiidleware } from '../middlewares/authMiddlware'
import { commentsService } from '../domains/comments-services'
import { commentsRepository } from '../repositories/comments-db-repository'

type ErrorObject = { message: string; field: string }

const ErrorFormatter = (error: ValidationError): ErrorObject => {
  switch (error.type) {
    case 'field':
      return {
        message: error.msg,
        field: error.path,
      }
    default:
      return {
        message: error.msg,
        field: 'None',
      }
  }
}

export const commentsRouter = () => {
  const router = Router()

  router.put(
    '/:commentId/like-status',
    authMiidleware,
    validationMiidleware.likeStatusValidation,
    async (req: Request, res: Response) => {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        const errorsArray = errors.array({ onlyFirstError: true })
        const errorsMessages = errorsArray.map((e) => ErrorFormatter(e))

        return res.status(400).send({ errorsMessages })
      } else {
        const commentId = req.params.id
        const comment = await commentsService.findById(req.user!.id, commentId)
        console.log('58----comments.route', comment)

        if (!comment) return res.sendStatus(404)
        const { likeStatus } = req.body
        const result = await commentsService.updateLikeStatus(
          comment,
          likeStatus
        )
        if (result) {
          return res.sendStatus(204)
        } else {
          return res.sendStatus(404)
        }

        return res.sendStatus(404)
      }
    }
  )

  router.put(
    '/:id',
    authMiidleware,
    validationMiidleware.commentContentValidation,
    async (req: Request, res: Response) => {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        const errorsArray = errors.array({ onlyFirstError: true })
        const errorsMessages = errorsArray.map((e) => ErrorFormatter(e))

        return res.status(400).send({ errorsMessages })
      } else {
        const commentId = req.params.id
        const owner = await commentsService.findById(req.user!.id, commentId)
        console.log('58----comments.route', owner)
        console.log('59----comments.route', req.user!)

        if (owner) {
          if (owner.commentatorInfo.userId !== req.user!.id.toString()) {
            return res.sendStatus(403)
          }
          const { content } = req.body
          const result = await commentsService.updateComment(commentId, content)
          if (result) {
            return res.sendStatus(204)
          } else {
            return res.sendStatus(404)
          }
        }
        return res.sendStatus(404)
      }
    }
  )

  router.delete('/:id', authMiidleware, async (req: Request, res: Response) => {
    const commentId = req.params.id
    const owner = await commentsService.findById(req.user!.id, commentId)
    console.log('82----comments.route', owner)
    console.log('83----comments.route', req.user!.id.toString())
    console.log('84----comments.route', req.user!)

    if (owner) {
      if (owner.commentatorInfo.userId !== req.user!.id.toString()) {
        console.log('86----comments.route', req.user!.id.toString())
        return res.sendStatus(403)
      }
      console.log('92---comments.router')

      const result = await commentsService.deleteComment(commentId)
      if (result) {
        return res.sendStatus(204)
      } else {
        return res.sendStatus(404)
      }
    }
    console.log('99---comments.router')

    return res.sendStatus(404)
  })
  router.get('/:id', authMiidleware, async (req: Request, res: Response) => {
    const commentId = req.params.id

    const comment = await commentsRepository.findById(req.user!.id, commentId)
    // добавляем blogName
    if (comment) {
      res.status(200).json(comment)
    } else {
      res.sendStatus(404)
    }
  })

  /*
  router.get('/', async (req: Request, res: Response) => {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } =
      req.query
    const result: any = await blogsRepository.findAll(
      searchNameTerm?.toString(),
      sortBy?.toString(),
      sortDirection?.toString(),
      pageNumber?.toString(),
      pageSize?.toString()
    )

    res.status(200).json(result)
  })
*/
  return router
}
