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

export const usersRouter = () => {
  const router = Router()

  const auth = (basicString: string | undefined) => {
    return basicString === `Basic YWRtaW46cXdlcnR5` ? true : false
  }

  router.post(
    '/',
    validationMiidleware.newLoginValidation,
    validationMiidleware.passwordValidation,
    validationMiidleware.newEmailValidation,
    async (req: Request, res: Response) => {
      const checkAuth = auth(req.headers.authorization)
      if (!checkAuth) {
        res.sendStatus(401)
        return
      }

      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        const errorsArray = errors.array({ onlyFirstError: true })
        const errorsMessages = errorsArray.map((e) => ErrorFormatter(e))

        res.status(400).send({ errorsMessages })
      } else {
        const { login, password, email } = req.body
        // TODO: проверка на уникальность?

        // -------
        const newUser = await usersService.createUser(login, email, password)
        res.status(201).json(newUser)
      }
    }
  )

  router.get('/', async (req: Request, res: Response) => {
    const {
      searchLoginTerm,
      searchEmailTerm,
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
    } = req.query

    const result: ResultUser = await usersRepository.findAllUsers(
      searchLoginTerm?.toString(),
      searchEmailTerm?.toString(),
      sortBy?.toString(),
      sortDirection?.toString(),
      pageNumber?.toString(),
      pageSize?.toString()
    )

    res.status(200).json(result)
  })

  router.delete('/:id', async (req: Request, res: Response) => {
    const checkAuth = auth(req.headers.authorization)
    if (!checkAuth) {
      res.sendStatus(401)
      return
    }
    const id = req.params.id
    console.log('101--users.route-delete-id', id)
    const isExist = await usersRepository.findById(id)
    console.log('103--users.route-isExist', isExist)

    if (!isExist) return res.sendStatus(404)
    // return deletedCount === 1 - достаточно?
    const result = await usersService.deleteUser(id)
    if (result) {
      return res.sendStatus(204)
    } else {
      return res.sendStatus(444)
    }
  })

  return router
}
