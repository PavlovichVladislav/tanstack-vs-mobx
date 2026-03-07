import express from "express"
import cors from "cors"

import userRoutes from "./routes/user"
import countersRoutes from "./routes/counters"
import triggersRoutes from "./routes/triggers"

const app = express()

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
)
app.use(express.json())

app.use("/api", userRoutes)
app.use("/api/counters", countersRoutes)
app.use("/api/triggers", triggersRoutes)

const PORT = 4000

app.listen(PORT, () => {
  console.log(`Mock API running on http://localhost:${PORT}`)
})