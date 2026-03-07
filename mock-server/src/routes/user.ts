import { Router } from "express"
import { delay } from "../utils/delay"
import { user } from "../data/db"

const router = Router()

router.get("/me", async (_, res) => {
  await delay()

  res.json(user)
})

export default router