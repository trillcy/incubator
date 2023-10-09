import { type ViewUserType } from './types/types'
declare global {
  namespace Express {
    export interface Request {
      user: ViewUserType | null
      count: number
    }
  }
}
