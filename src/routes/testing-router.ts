import { Request, Response, Router } from 'express'
import { type VideoType } from '../db/db'

export const testingRouter = (db: VideoType[]) => {
  const router = Router()

  router.delete('/all-data', (req: Request, res: Response) => {
    db = []
    enum Resol {
      P123,
      P124,
      P125,
      P126,
    }
    for (let item in Resol) {
    }

    res.sendStatus(204)
  })
  return router
}
