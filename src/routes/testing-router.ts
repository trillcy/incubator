import { Request, Response, Router } from 'express'

export const testingRouter = Router()

testingRouter.delete('/all-data', (req: Request, res: Response) => {
  let helloMessage = 'Hello Incubator!'
  res.send(helloMessage)
})
