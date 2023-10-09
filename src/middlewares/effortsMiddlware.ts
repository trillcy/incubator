// import { Request, Response, NextFunction } from 'express'
// import { devicesRepository } from '../repositories/devices-db-repository'
// import { jwtService } from '../applications/jwt-services'

// const limitReq = 5

// export const effortsMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const request = {
//     URL: req.originalUrl,
//     IP: req.ip,
//     date: new Date(),
//   }

//   const countOfRequests = await reqCollection.countDocuments({
//     IP: request.IP,
//     URL: request.URL,
//     date: { $gte: new Date(Date.now() - 10000) },
//   })

//   if (countOfRequests >= limitReq) return res.sendStatus(429)

//   await reqCollection.insertOne({ ...request })
//   return next()
// }
