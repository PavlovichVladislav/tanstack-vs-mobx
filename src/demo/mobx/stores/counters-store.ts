import { makeAutoObservable, runInAction } from 'mobx'

import type { Counter } from '@/entities/counter/types'
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

    this.currentSearch = search

    /** 
     * @todo зачем разделять fetching и loading? 
     * видимо, чтоб не показывать крутилку, но этого можно добиться проверкой наличия данных
     * почему listError не во всех ошибках сбрасывается?
    */
    if (silent) {
      this.isListFetching = true
    } else {
      this.isListLoading = true
      this.listError = null
    }

    try {
      const counters = await countersApi.getList({
        search: search || undefined,
      })

      runInAction(() => {
        this.counters = counters

        if (this.selectedCounter) {
          const actualSelected =
            counters.find((counter) => counter.id === this.selectedCounter?.id) ??
            null

          this.selectedCounter = actualSelected
        }
      })
    } catch (error) {
      runInAction(() => {
        this.listError = getErrorMessage(error)
      })
    } finally {
      runInAction(() => {
        this.isListLoading = false
        this.isListFetching = false
      })
    }
  }

  async fetchCounter(counterId: string) {
    this.isDetailsLoading = true
    this.detailsError = null

    try {
      const counter = await countersApi.getById(counterId)

      runInAction(() => {
        this.selectedCounter = counter

        /** @todo а надо менять? */
        this.counters = this.counters.map((item) =>
          item.id === counter.id ? counter : item,
        )
      })
    } catch (error) {
      runInAction(() => {
        this.detailsError = getErrorMessage(error)
      })
    } finally {
      runInAction(() => {
        this.isDetailsLoading = false
      })
    }
  }

  setSelectedFromList(counterId: string | null) {
    if (!counterId) {
      this.selectedCounter = null
      return
    }

    const counter =
      this.counters.find((item) => item.id === counterId) ?? null

    this.selectedCounter = counter
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
      void this.fetchCounters(this.currentSearch, { silent: true })
    }, this.pollingIntervalMs)
  }

  stopPolling() {
    if (this.pollingTimerId !== null) {
      window.clearInterval(this.pollingTimerId)
      this.pollingTimerId = null
    }
  }
}