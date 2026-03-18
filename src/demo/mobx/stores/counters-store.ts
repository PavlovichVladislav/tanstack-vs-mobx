import { makeAutoObservable, runInAction } from 'mobx'

import type { Counter } from '@/entities/counter/types'
import { isApiError } from '@/shared/api/api-error'
import { countersApi } from '@/shared/api/counters-api'
import { getErrorMessage } from '@/shared/lib/errors'

export class CountersStore {
  counters: Counter[] = []
  selectedCounter: Counter | null = null

  isListLoading = false
  isListFetching = false
  listError: string | null = null

  isDetailsLoading = false
  detailsError: string | null = null

  isRemovingBan = false
  removeBanError: string | null = null

  /** Нужно для того, чтобы polling происходил с текущим значением в строке поиска. */
  currentSearch = ''
  pollingIntervalMs = 10_000
  private pollingTimerId: number | null = null
  private listController: AbortController | null = null
  private detailsController: AbortController | null = null

  constructor() {
    makeAutoObservable(this)
  }

  get totalCounters() {
    return this.counters.length
  }

  get bannedCounters() {
    return this.counters.filter((counter) => counter.isBanned).length
  }

  get hasPolling() {
    return this.pollingTimerId !== null
  }

  async fetchCounters(search: string, options?: { silent?: boolean }) {
    const silent = options?.silent ?? false

    this.listController?.abort()
    const controller = new AbortController()
    this.listController = controller
    this.currentSearch = search

    /**
     * silent разделяет два состояния - начальная загрузка и фоновое обновление(silent)
     * 
     * Для начальной загрузки и фонового обновления свои состояния.
     */
    if (silent) {
      this.isListFetching = true
    } else {
      this.isListLoading = true
      this.listError = null
    }

    try {
      const counters = await countersApi.getList(
        {
          search: search || undefined,
        },
        controller.signal,
      )

      /** Если для store существует более свежий запрос, то он уже установил
       * свой this.listController, а результат текущегоз запроса(controller) игнорируется/
       */
      if (this.listController !== controller) {
        return
      }

      runInAction(() => {
        this.counters = counters

        if (this.selectedCounter) {
          this.selectedCounter =
            counters.find((counter) => counter.id === this.selectedCounter?.id) ??
            null
        }
      })
    } catch (error) {
      if (
        this.listController !== controller ||
        (isApiError(error) && error.isAborted)
      ) {
        return
      }

      runInAction(() => {
        this.listError = getErrorMessage(error)
      })
    } finally {
      if (this.listController !== controller) {
        return
      }

      runInAction(() => {
        this.isListLoading = false
        this.isListFetching = false
        this.listController = null
      })
    }
  }

  async fetchCounter(counterId: string) {
    this.detailsController?.abort()
    const controller = new AbortController()
    this.detailsController = controller

    this.isDetailsLoading = true
    this.detailsError = null

    try {
      const counter = await countersApi.getById(counterId, controller.signal)

      if (this.detailsController !== controller) {
        return
      }

      runInAction(() => {
        this.selectedCounter = counter
        this.counters = this.counters.map((item) =>
          item.id === counter.id ? counter : item,
        )
      })
    } catch (error) {
      if (
        this.detailsController !== controller ||
        (isApiError(error) && error.isAborted)
      ) {
        return
      }

      runInAction(() => {
        this.detailsError = getErrorMessage(error)
      })
    } finally {
      if (this.detailsController !== controller) {
        return
      }

      runInAction(() => {
        this.isDetailsLoading = false
        this.detailsController = null
      })
    }
  }

  /**
   * Выбор для улучшения UX, пока не загружена фулл инфа, покажем то, что знаем о счетчике. 
   * Остальные поля - skeltons.
   */
  setSelectedFromList(counterId: string | null) {
    if (!counterId) {
      this.selectedCounter = null
      return
    }

    this.selectedCounter =
      this.counters.find((item) => item.id === counterId) ?? null
  }

  clearSelection() {
    this.detailsController?.abort()
    this.detailsController = null
    this.selectedCounter = null
    this.isDetailsLoading = false
    this.detailsError = null
  }

  async removeBan(counterId: string) {
    this.isRemovingBan = true
    this.removeBanError = null

    try {
      const updatedCounter = await countersApi.removeBan(counterId)

      runInAction(() => {
        this.selectedCounter = updatedCounter
        this.counters = this.counters.map((counter) =>
          counter.id === updatedCounter.id ? updatedCounter : counter,
        )
      })
    } catch (error) {
      runInAction(() => {
        this.removeBanError = getErrorMessage(error)
      })
    } finally {
      runInAction(() => {
        this.isRemovingBan = false
      })
    }
  }

  startPolling() {
    if (this.pollingTimerId !== null) {
      return
    }

    this.pollingTimerId = window.setInterval(() => {
      this.fetchCounters(this.currentSearch, { silent: true })
    }, this.pollingIntervalMs)
  }

  stopPolling() {
    if (this.pollingTimerId !== null) {
      window.clearInterval(this.pollingTimerId)
      this.pollingTimerId = null
    }
  }

  abortPending() {
    this.listController?.abort()
    this.detailsController?.abort()
    this.listController = null
    this.detailsController = null
  }
}
