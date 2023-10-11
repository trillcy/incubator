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
    const email = 'andreiincubator@gmail.com'
    const user = await usersRepository.findByEmail(email)
    console.log('15---', user)

    if (!user) return res.sendStatus(404)
    const result = await authService.sendPasswordRecoveryEmail(user.id, email)
    console.log('22---', result)

    return res.status(200).json(result)
  })
  return router
}
