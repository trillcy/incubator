import express, { Request, Response } from 'express'
import { videosRouter } from './routes/videos-router'
import { testingRouter } from './routes/testing-router'

const app = express()
const port = 3003

app.use('/videos', videosRouter)
app.use('/testing', testingRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
