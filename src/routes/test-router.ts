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
    const obj1 = {
      age: 18,
      getAge() {
        console.log(this)
        console.log(this.age)
      },
    }
    const obj2 = {
      age: 2,
      showAge: obj1.getAge,
    }
    const obj3 = {
      age: 444,
      findAge: obj2.showAge,
    }
    // obj1.getAge()
    // obj1.getAge.bind(obj1)
    // obj2.showAge.bind(obj1)
    obj2.showAge()
    obj3.findAge.bind(obj1)()

    // const result = await usersRepository.findByCode(
    //   '2c6e2fa1-2c0f-4fa5-8dec-2ceeeeb8ebfb'
    // )
    return res.status(200).json(obj1)
  })
  return router
}
