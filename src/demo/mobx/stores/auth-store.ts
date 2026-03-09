import type { User } from '@/entities/user/types'
import { authApi } from '@/shared/api/auth-api'
import { getErrorMessage } from '@/shared/lib/errors'
import { makeAutoObservable, runInAction } from 'mobx'

export class AuthStore {
  user: User | null = null
  isLoading = false
  error: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  async fetchMe() {
    this.isLoading = true
    this.error = null

    try {
      const user = await authApi.getMe()

      runInAction(() => {
        this.user = user
      })
    } catch (error) {
      runInAction(() => {
        this.error = getErrorMessage(error)
      })
    } finally {
      runInAction(() => {
        this.isLoading = false
      })
    }
  }
}