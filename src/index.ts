import express, { Request, Response } from 'express'
const app = express()
const port = 3003

app.get('/', (req: Request, res: Response) => {
  let helloMessage = 'Hello Incubator!'
  debugger

  res.send(helloMessage)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
