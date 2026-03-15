import type { User } from '@/entities/user/types'
import { isApiError } from '@/shared/api/api-error'
import { authApi } from '@/shared/api/auth-api'
import { getErrorMessage } from '@/shared/lib/errors'
import { makeAutoObservable, runInAction } from 'mobx'

export class AuthStore {
  user: User | null = null
  isLoading = false
  error: string | null = null
  private fetchController: AbortController | null = null

  constructor() {
    makeAutoObservable(this)
  }

  async fetchMe() {
    this.fetchController?.abort()
    const controller = new AbortController()
    this.fetchController = controller

    this.isLoading = true
    this.error = null

    try {
      const user = await authApi.getMe(controller.signal)

      if (this.fetchController !== controller) {
        return
      }

      runInAction(() => {
        this.user = user
      })
    } catch (error) {
      if (
        this.fetchController !== controller ||
        (isApiError(error) && error.isAborted)
      ) {
        return
      }

      runInAction(() => {
        this.error = getErrorMessage(error)
      })
    } finally {
      if (this.fetchController !== controller) {
        return;
      }

      runInAction(() => {
        this.isLoading = false
        this.fetchController = null
      })
    }
  }

  abortPending() {
    this.fetchController?.abort()
    this.fetchController = null
  }
}
