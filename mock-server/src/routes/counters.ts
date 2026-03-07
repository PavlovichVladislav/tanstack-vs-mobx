import { Router } from "express"
import { counters } from "../data/db"
import { delay } from "../utils/delay"

const router = Router()

router.get("/", async (req, res) => {
  await delay()

  const search = req.query.search?.toString().toLowerCase()

  if (!search) {
    return res.json(counters)
  }

  const filtered = counters.filter((c) =>
    c.name.toLowerCase().includes(search)
  )

  res.json(filtered)
})

router.get("/:id", async (req, res) => {
  await delay()

  const counter = counters.find((c) => c.id === req.params.id)

  if (!counter) {
    return res.status(404).json({
      message: "Counter not found",
      code: "NOT_FOUND",
      details: { counterId: req.params.id }
    })
  }

  res.json(counter)
})

router.post("/:id/remove-ban", async (req, res) => {
  await delay()

  const counter = counters.find((c) => c.id === req.params.id)

  if (!counter) {
    return res.status(404).json({
      message: "Counter not found",
      code: "NOT_FOUND",
      details: { counterId: req.params.id }
    })
  }

  counter.isBanned = false
  counter.updatedAt = Date.now()

  res.json(counter)
})

export default router