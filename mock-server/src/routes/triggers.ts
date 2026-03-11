import { Router } from 'express'

import { triggers } from '../data/db'
import { delay } from '../utils/delay'
import { sendError } from '../utils/http-error'
import { shouldFail } from '../utils/random-error'

const router = Router()

router.get('/:counterId', async (req, res) => {
  await delay()

  if (shouldFail(0.06)) {
    return sendError(res, 500, {
      message: 'Temporary triggers failure',
      code: 'SERVER_ERROR',
      details: {
        counterId: req.params.counterId,
      },
    })
  }

  const result = triggers.filter(
    (trigger) => trigger.counterId === req.params.counterId,
  )

  return res.json(result)
})

router.patch('/:id', async (req, res) => {
  await delay()

  const trigger = triggers.find((item) => item.id === req.params.id)

  if (!trigger) {
    return sendError(res, 404, {
      message: 'Trigger not found',
      code: 'NOT_FOUND',
      details: {
        triggerId: req.params.id,
      },
    })
  }

  const { threshold, enabled } = req.body ?? {}

  if (
    threshold !== undefined &&
    (typeof threshold !== 'number' || Number.isNaN(threshold) || threshold < 0)
  ) {
    return sendError(res, 422, {
      message: 'Invalid trigger threshold',
      code: 'VALIDATION_ERROR',
      details: {
        field: 'threshold',
      },
    })
  }

  if (enabled !== undefined && typeof enabled !== 'boolean') {
    return sendError(res, 422, {
      message: 'Invalid trigger enabled flag',
      code: 'VALIDATION_ERROR',
      details: {
        field: 'enabled',
      },
    })
  }

  if (threshold !== undefined) {
    trigger.threshold = threshold
  }

  if (enabled !== undefined) {
    trigger.enabled = enabled
  }

  return res.json(trigger)
})

export default router