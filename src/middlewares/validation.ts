import {
  ValidationError,
  body,
  cookie,
  param,
  query,
  validationResult,
} from 'express-validator'
import { blogsRepository } from '../repositories/blogs-db-repository'
import { usersRepository } from '../repositories/users-db-repository'
import { jwtService } from '../applications/jwt-services'

export const validationMiidleware = {
  titleValidation: body('title')
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 30 }),

  shortDescriptionValidation: body('shortDescription')
    .isString()
    .isLength({ min: 1, max: 100 }),

  contentValidation: body('content')
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 1000 }),

  commentContentValidation: body('content')
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 20, max: 300 }),

  blogIdValidation: body('blogId')
    .isString()
    .trim()
    .notEmpty()
    .exists({ checkFalsy: true })
    .custom(async (value) => {
      const blog = await blogsRepository.findById(value)
      if (!blog) throw new Error('incorrect blogId')
      return true
    }),

  // =============
  idValidation: param('id')
    .isString()
    .trim()
    .notEmpty()
    .exists({ checkFalsy: true }),

  nameValidation: body('name')
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 15 }),

  descriptionValidation: body('description')
    .isString()
    .isLength({ min: 1, max: 500 }),

  websiteUrlValidation: body('websiteUrl').isString().isURL(),
  // =====
  auth: (basicString: string | undefined) => {
    return basicString === `Basic YWRtaW46cXdlcnR5` ? true : false
  },
  // =====
  // ^[a-zA-Z0-9_-]*$
  newLoginValidation: body('login')
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 3, max: 10 })
    .escape()
    .custom(async (value) => {
      const user = await usersRepository.findByLogin(value)
      if (user) throw new Error('user exists')
      return true
    }),

  passwordValidation: body('password')
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 6, max: 20 }),

  newEmailValidation: body('email')
    .isString()
    .trim()
    .notEmpty()
    .isEmail()
    .custom(async (value) => {
      const user = await usersRepository.findByEmail(value)
      if (user) throw new Error('user exists')
      return true
    }),

  emailValidation: body('email')
    .isString()
    .trim()
    .notEmpty()
    .isEmail()
    .custom(async (value) => {
      const user = await usersRepository.findByEmail(value)
      if (!user) throw new Error('user doesnt exist')
      if (user?.isConfirmed) throw new Error('email exists')
      return true
    }),

  loginOrEmailValidation: body('loginOrEmail')
    .isString()
    .trim()
    .notEmpty()
    .custom(async (value) => {
      const user = await usersRepository.findUserByLoginOrEmail(value)
      console.log('118++++valid', user)

      if (!user) {
        throw new Error('user doesnt exist')
      } else {
        // if (user.emailConfirmation.isConfirmed) throw new Error('code exists')
        return true
      }
    }),

  codeValidation: body('code')
    .isString()
    .trim()
    .notEmpty()
    .custom(async (value) => {
      const user = await usersRepository.findByCode(value)

      if (!user) throw new Error('user doesnt exist')
      if (user.emailConfirmation.isConfirmed) throw new Error('code exists')
      return true
    }),
}
