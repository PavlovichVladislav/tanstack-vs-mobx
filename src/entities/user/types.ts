export type UserRole = 'admin' | 'viewer'

export type User = {
  id: string
  name: string
  avatar: string
  role: UserRole | string
}