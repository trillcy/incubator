import {
  ValidationError,
  body,
  param,
  validationResult,
} from 'express-validator'
import { blogsRepository } from '../repositories/blogs-db-repository'

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

  blogIdValidation: body('id')
    .isString()
    .trim()
    .notEmpty()
    .exists({ checkFalsy: true })
    .custom(async (value) => {
      const blog = await blogsRepository.findById(value)
      console.log('56====', blog)
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
    // .custom(({ req }) => {
    //   return `Basic YWRtaW46cXdlcnR5` === req.headers.authorization
    // })
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 15 }),

  descriptionValidation: body('description')
    .isString()
    .isLength({ min: 1, max: 500 }),

  websiteUrlValidation: body('websiteUrl').isString().isURL(),

  auth: (basicString: string | undefined) => {
    return basicString === `Basic YWRtaW46cXdlcnR5` ? true : false
  },
}
