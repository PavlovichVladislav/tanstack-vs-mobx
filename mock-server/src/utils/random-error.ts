import { RANDOM_ERROR_RATE } from '../constants/server'

export function shouldFail(rate = RANDOM_ERROR_RATE) {
  return Math.random() < rate
}