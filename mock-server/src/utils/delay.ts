import {
  NETWORK_DELAY_MAX_MS,
  NETWORK_DELAY_MIN_MS,
} from '../constants/server'

export function getRandomDelay() {
  return (
    NETWORK_DELAY_MIN_MS +
    Math.floor(Math.random() * (NETWORK_DELAY_MAX_MS - NETWORK_DELAY_MIN_MS))
  )
}

export const delay = (ms = getRandomDelay()) =>
  new Promise((resolve) => setTimeout(resolve, ms))