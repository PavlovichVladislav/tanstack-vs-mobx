import type { ServerStats } from '../types/api'

export const serverStats: ServerStats = {
  requestsTotal: 0,
  failedRequestsTotal: 0,
  countersUpdatedTotal: 0,
  startedAt: Date.now(),
}