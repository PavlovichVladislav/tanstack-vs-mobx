import { makeAutoObservable, runInAction } from 'mobx'

import type { Trigger, UpdateTriggerPayload } from '@/entities/trigger/types'
import { triggersApi } from '@/shared/api/triggers-api'
import { getErrorMessage } from '@/shared/lib/errors'

export class TriggersStore {
  /** Это кэшик? */
  triggersByCounterId = new Map<string, Trigger[]>()

  isLoading = false
  isSaving = false
  error: string | null = null
  saveError: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  getTriggers(counterId: string | null): Trigger[] {
    if (!counterId) {
      return []
    }

    return this.triggersByCounterId.get(counterId) ?? []
  }

  getEnabledTriggersCount(counterId: string | null) {
    return this.getTriggers(counterId).filter((trigger) => trigger.enabled).length
  }

  async fetchTriggers(counterId: string) {
    this.isLoading = true
    this.error = null

    try {
      const triggers = await triggersApi.getList(counterId)

      runInAction(() => {
        this.triggersByCounterId.set(counterId, triggers)
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

  async updateTrigger(counterId: string, triggerId: string, payload: UpdateTriggerPayload) {
    this.isSaving = true
    this.saveError = null

    try {
      const updatedTrigger = await triggersApi.update(triggerId, payload)

      runInAction(() => {
        const current = this.triggersByCounterId.get(counterId) ?? []

        this.triggersByCounterId.set(
          counterId,
          current.map((trigger) =>
            trigger.id === updatedTrigger.id ? updatedTrigger : trigger,
          ),
        )
      })
    } catch (error) {
      runInAction(() => {
        this.saveError = getErrorMessage(error)
      })
    } finally {
      runInAction(() => {
        this.isSaving = false
      })
    }
  }
}