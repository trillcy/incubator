import { Request, Response, Router } from 'express'

export const videosRouter = Router()

videosRouter.get('/', (req: Request, res: Response) => {
  let helloMessage = 'Hello Incubator!'
  res.send(helloMessage)
})

videosRouter.get('/:id', (req: Request, res: Response) => {
  let helloMessage = 'Hello Incubator!'
  res.send(helloMessage)
})

videosRouter.post('/', (req: Request, res: Response) => {
  let helloMessage = 'Hello Incubator!'
  res.send(helloMessage)
})

videosRouter.put('/:id', (req: Request, res: Response) => {
  let helloMessage = 'Hello Incubator!'
  res.send(helloMessage)
})

videosRouter.delete('/:id', (req: Request, res: Response) => {
  let helloMessage = 'Hello Incubator!'
  res.send(helloMessage)
})
