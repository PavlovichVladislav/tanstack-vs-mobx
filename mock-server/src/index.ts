import cors from 'cors'
import express from 'express'

import { SERVER_PORT } from './constants/server'
import countersRoutes from './routes/counters'
import debugRoutes from './routes/debug'
import triggersRoutes from './routes/triggers'
import userRoutes from './routes/user'
import { startCountersTicker } from './utils/counters-ticker'
import { requestMetricsMiddleware } from './utils/request-metrics'

const app = express()

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
)
app.use(express.json())
app.use(requestMetricsMiddleware)

app.use('/api', userRoutes)
app.use('/api/counters', countersRoutes)
app.use('/api/triggers', triggersRoutes)
app.use('/api/debug', debugRoutes)

startCountersTicker()

app.listen(SERVER_PORT, () => {
  console.log(`Mock API running on http://localhost:${SERVER_PORT}`)
})