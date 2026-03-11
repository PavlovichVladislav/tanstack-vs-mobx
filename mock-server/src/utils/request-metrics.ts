import type { NextFunction, Request, Response } from 'express'
import { serverStats } from '../data/stats'

export function requestMetricsMiddleware(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  serverStats.requestsTotal += 1

  res.on('finish', () => {
    if (res.statusCode >= 400) {
      serverStats.failedRequestsTotal += 1
    }
  })

  next()
}