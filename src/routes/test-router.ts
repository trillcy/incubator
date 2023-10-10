import { config } from 'dotenv'
config()
import { Request, Response, Router, query } from 'express'
import { ValidationError, validationResult } from 'express-validator'
import { effortsRepository } from '../repositories/efforts-db-repository'

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

export const testRouter = () => {
  const router = Router()
  router.get('/', async (req: Request, res: Response) => {
    const effort = {
      URL: '/auth/registration',
      IP: '35.156.186.92',
      inMSeconds: 10000,
    }
    const result = await effortsRepository.countDocuments(effort)
    return res.status(200).json(result)
  })

  return router
}
