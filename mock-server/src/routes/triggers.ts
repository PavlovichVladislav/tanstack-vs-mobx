import { Router } from "express"
import { triggers } from "../data/db"
import { delay } from "../utils/delay"

const router = Router()

router.get("/:counterId", async (req, res) => {
  await delay()

  const result = triggers.filter(
    (t) => t.counterId === req.params.counterId
  )

  res.json(result)
})

router.patch("/:id", async (req, res) => {
  await delay()

  const trigger = triggers.find((t) => t.id === req.params.id)

  if (!trigger) {
    return res.status(404).json({
      message: "Counter not found",
      code: "NOT_FOUND",
      details: { counterId: req.params.id }
    })
  }

  Object.assign(trigger, req.body)

  res.json(trigger)
})

export default router