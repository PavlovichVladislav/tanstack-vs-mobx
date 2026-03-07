import { Counter, Trigger, User } from "../types/api"

export const user: User = {
  id: "u1",
  name: "Admin User",
  avatar: "https://i.pravatar.cc/150?img=3",
  role: "admin"
}

export const counters: Counter[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `c-${i}`,
  name: `rate-limit-${i}`,
  limit: 100,
  currentValue: Math.floor(Math.random() * 150),
  isBanned: Math.random() > 0.7,
  updatedAt: Date.now()
}))

export const triggers: Trigger[] = Array.from({ length: 40 }).map((_, i) => ({
  id: `t-${i}`,
  counterId: `c-${Math.floor(Math.random() * 20)}`,
  type: Math.random() > 0.5 ? "telegram" : "moira",
  threshold: Math.floor(Math.random() * 100),
  enabled: Math.random() > 0.5
}))