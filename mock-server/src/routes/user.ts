import { Router } from 'express'
import { user } from '../data/db'
import { delay } from '../utils/delay'

const router = Router()

router.get('/me', async (_req, res) => {
  await delay()
  res.json(user)
})

export default router