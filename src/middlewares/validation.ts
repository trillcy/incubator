import {
  ValidationError,
  body,
  param,
  query,
  validationResult,
} from 'express-validator'
import { blogsRepository } from '../repositories/blogs-db-repository'
import { usersRepository } from '../repositories/users-db-repository'

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
  loginValidation: body('login')
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

  emailValidation: body('email')
    .isString()
    .trim()
    .notEmpty()
    .isEmail()
    .custom(async (value) => {
      const user = await usersRepository.findByEmail(value)
      if (user) throw new Error('user exists')
      return true
    }),

  loginOrEmailValidation: body('loginOrEmail').isString().trim().notEmpty(),
  // .custom(async (value) => {
  //   const user = await usersRepository.findUserByLoginOrEmail(value)
  //   console.log('98====valid', user)
  //   if (!user) throw new Error('user doesnt exist. you should register')
  //   return true
  // }),
}
