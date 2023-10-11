import { config } from 'dotenv'
config()
import { Request, Response, Router, query } from 'express'
import { usersRepository } from '../repositories/users-db-repository'
import { ObjectId } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { add } from 'date-fns'
import { authService } from '../domains/auth-services'

export const testRouter = () => {
  const router = Router()
  router.get('/', async (req: Request, res: Response) => {
    const result = await usersRepository.findByCode(
      '2c6e2fa1-2c0f-4fa5-8dec-2ceeeeb8ebfb'
    )
    return res.status(200).json(result)
  })
  return router
}
