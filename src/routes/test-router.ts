import { config } from 'dotenv'
config()
import { Request, Response, Router, query } from 'express'
import { usersRepository } from '../repositories/users-db-repository'
import { ObjectId } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { add } from 'date-fns'

export const testRouter = () => {
  const router = Router()
  router.get('/', async (req: Request, res: Response) => {
    const updatedObject = {
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), { hours: 1, minutes: 3 }),
        isConfirmed: false,
      },
    }
    const result = await usersRepository.updateUser(
      '6526c640de00dadb5388ff1f',
      updatedObject
    )
    console.log('23---test', result)
    return res.status(200).json(result)
  })
  return router
}
