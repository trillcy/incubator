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
import { authService } from '../domains/auth-services'

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
        const commentId = req.params.commentId
        const userId = req.user ? req.user.id : null
        if (!userId) return res.sendStatus(401)
        console.log('58---comm.route', commentId)

        const comment = await commentsService.findById(userId, commentId)
        console.log('58----comments.route', comment)

        if (!comment) return res.sendStatus(404)
        const { likeStatus } = req.body
        const result = await commentsService.updateLikeStatus(
          userId,
          comment,
          likeStatus
        )
        if (!result) return res.sendStatus(404)
        return res.sendStatus(204)
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
        const userId = req.user ? req.user.id : null
        const owner = await commentsService.findById(userId, commentId)
        console.log('90----comments.route', owner)
        console.log('91----comments.route', req.user!)

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
    const userId = req.user ? req.user.id : null
    const owner = await commentsService.findById(userId, commentId)
    console.log('117----comments.route', userId)
    console.log('118----comments.route', req.user!)

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
  router.get('/:id', async (req: Request, res: Response) => {
    const commentId = req.params.id
    // проверяем можем ли мы получить user из accessToken
    let userId = null
    if (req.headers.authorization) {
      userId = await authService.getUserIdInAccessToken(
        req.headers.authorization
      )
    }
    console.log('145--comm.route-userId', userId)

    const comment = await commentsRepository.findById(userId, commentId)
    console.log('150-comm.route-get', comment)

    // добавляем blogName
    if (comment) {
      res.status(200).json(comment)
    } else {
      res.sendStatus(404)
    }
  })

  return router
}
