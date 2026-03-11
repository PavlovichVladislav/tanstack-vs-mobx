import type { Response } from 'express'
import type { ErrorResponse } from '../types/api'

export function sendError(
  res: Response,
  status: number,
  payload: ErrorResponse,
) {
  return res.status(status).json(payload)
}