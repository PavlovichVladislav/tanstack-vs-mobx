import { makeAutoObservable, runInAction } from 'mobx'

import type { Trigger, UpdateTriggerPayload } from '@/entities/trigger/types'
import { isApiError } from '@/shared/api/api-error'
import { triggersApi } from '@/shared/api/triggers-api'
import { getErrorMessage } from '@/shared/lib/errors'

export class TriggersStore {
  /** Кэш необходим, т.к. при переключении между счетчиками загружаются тригеры, 
   * чтобы при переключении A - B - A не было лишнего запроса на тригеры A.
   */
  triggersByCounterId = new Map<string, Trigger[]>()

  isLoading = false
  isSaving = false
  error: string | null = null
  saveError: string | null = null
  activeCounterId: string | null = null
  private fetchController: AbortController | null = null

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
    this.fetchController?.abort()
    const controller = new AbortController()
    this.fetchController = controller
    this.activeCounterId = counterId

    this.isLoading = true
    this.error = null

    try {
      const triggers = await triggersApi.getList(counterId, controller.signal)

      if (this.fetchController !== controller) {
        return
      }

      runInAction(() => {
        this.triggersByCounterId.set(counterId, triggers)
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
        return
      }

      runInAction(() => {
        this.isLoading = false
        this.fetchController = null
      })
    }
  }

  async updateTrigger(
    counterId: string,
    triggerId: string,
    payload: UpdateTriggerPayload,
  ) {
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

  clearSelection() {
    this.fetchController?.abort()
    this.fetchController = null
    this.activeCounterId = null
    this.isLoading = false
    this.error = null
  }

  abortPending() {
    this.fetchController?.abort()
    this.fetchController = null
    this.activeCounterId = null
  }
}
