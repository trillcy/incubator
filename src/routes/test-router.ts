import { config } from 'dotenv'
config()
import { Request, Response, Router, query } from 'express'
import { ValidationError, validationResult } from 'express-validator'
import { effortsRepository } from '../repositories/efforts-db-repository'
import { usersRepository } from '../repositories/users-db-repository'
import { ObjectId } from 'mongodb'
import { type UserDBType } from '../types/types'

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
    const result = await usersRepository.updateUser(
      '652676b707f4ebb22aa550dc',
      {
        // _id: new ObjectId('652676b707f4ebb22aa550dc'),
        // accountData: {
        //   userName: {
        //     login: '000---sdgsgfaglfg',
        //     email: '0-0-84353745792hfksjdbdsb@mail.ru',
        //   },
        //   createdAt: new Date(),
        //   passwordSalt: '444shf;ussdfgsgak',
        //   passwordHash: '555dhsf;kusdfsgashgf',
        // },
        emailConfirmation: {
          confirmationCode: 'null---',
          expirationDate: new Date(Date.now() + 10000),
          isConfirmed: false,
        },
        deletedTokens: [],
      }
    )
    return res.status(200).json(result)
  })

  return router
}
