import { Router } from 'express'

import { counters } from '../data/db'
import { delay } from '../utils/delay'
import { sendError } from '../utils/http-error'
import { shouldFail } from '../utils/random-error'

const router = Router()

router.get('/', async (req, res) => {
  await delay()

  if (shouldFail(0.08)) {
    return sendError(res, 500, {
      message: 'Temporary counters list failure',
      code: 'SERVER_ERROR',
      details: {
        route: 'GET /api/counters',
      },
    })
  }

  const search = req.query.search?.toString().trim().toLowerCase()

  if (!search) {
    return res.json(counters)
  }

  const filtered = counters.filter((counter) =>
    counter.name.toLowerCase().includes(search),
  )

  return res.json(filtered)
})

router.get('/:id', async (req, res) => {
  await delay()

  const counter = counters.find((item) => item.id === req.params.id)

  if (!counter) {
    return sendError(res, 404, {
      message: 'Counter not found',
      code: 'NOT_FOUND',
      details: {
        counterId: req.params.id,
      },
    })
  }

  if (shouldFail(0.05)) {
    return sendError(res, 500, {
      message: 'Temporary counter details failure',
      code: 'SERVER_ERROR',
      details: {
        counterId: req.params.id,
      },
    })
  }

  return res.json(counter)
})

router.post('/:id/remove-ban', async (req, res) => {
  await delay()

  const counter = counters.find((item) => item.id === req.params.id)

  if (!counter) {
    return sendError(res, 404, {
      message: 'Counter not found',
      code: 'NOT_FOUND',
      details: {
        counterId: req.params.id,
      },
    })
  }

  counter.isBanned = false
  counter.updatedAt = Date.now()

  return res.json(counter)
})

export default router