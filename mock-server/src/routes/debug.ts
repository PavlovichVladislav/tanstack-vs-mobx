import { Router } from 'express'

import { counters } from '../data/db'
import { serverStats } from '../data/stats'

const router = Router()

router.get('/stats', (_req, res) => {
  res.json({
    ...serverStats,
    countersCount: counters.length,
    bannedCountersCount: counters.filter((counter) => counter.isBanned).length,
  })
})

export default router