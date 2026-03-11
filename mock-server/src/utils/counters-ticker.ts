import { counters } from '../data/db'
import { serverStats } from '../data/stats'
import { COUNTERS_TICK_INTERVAL_MS } from '../constants/server'

function getRandomDelta() {
  return Math.floor(Math.random() * 16) - 3
}

export function startCountersTicker() {
  windowLikeSetInterval(() => {
    counters.forEach((counter) => {
      const delta = getRandomDelta()
      const nextValue = Math.max(0, counter.currentValue + delta)

      if (nextValue !== counter.currentValue) {
        counter.currentValue = nextValue
        counter.updatedAt = Date.now()

        if (counter.currentValue > counter.limit && Math.random() > 0.5) {
          counter.isBanned = true
        }

        serverStats.countersUpdatedTotal += 1
      }
    })
  }, COUNTERS_TICK_INTERVAL_MS)
}

function windowLikeSetInterval(callback: () => void, delay: number) {
  return setInterval(callback, delay)
}