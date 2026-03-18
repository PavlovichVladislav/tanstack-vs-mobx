import { reaction, type IReactionDisposer } from 'mobx'

import { AuthStore } from './auth-store'
import { CountersStore } from './counters-store'
import { TriggersStore } from './triggers-store'
import { MobxUiStore } from './ui-store'

export class MobxRootStore {
  authStore: AuthStore
  countersStore: CountersStore
  triggersStore: TriggersStore
  uiStore: MobxUiStore
  private disposers: IReactionDisposer[] = []

  constructor() {
    this.authStore = new AuthStore()
    this.countersStore = new CountersStore()
    this.triggersStore = new TriggersStore()
    this.uiStore = new MobxUiStore()
  }

  /** Реализовали методы start и dispose. Проще следить за жизненным циклом
   * приложения. Компоненты тепреь больше читают данные из сторов, нежели дергают
   * методы жизненного цикла приложения - загрузи юзера, сделай полинг. Проще дебажить
   * и проще думтаь про логику в отдельности.
   */

  start() {
    if (this.disposers.length) {
      return
    }

    this.authStore.fetchMe()
    this.countersStore.startPolling()

    /** fireImmediately - запроси, даже если значение не менялось.
     * Аналог начального useEffect. Без него реакция бы сработала ток при запросе.
      */
    this.disposers = [
      reaction(
        () => this.uiStore.search,
        (search) => {
          this.countersStore.fetchCounters(search)
        },
        { fireImmediately: true },
      ),
      reaction(
        () => this.uiStore.selectedCounterId,
        (counterId) => {
          if (!counterId) {
            this.countersStore.clearSelection()
            this.triggersStore.clearSelection()
            return
          }

          this.countersStore.setSelectedFromList(counterId)
          this.countersStore.fetchCounter(counterId)
          this.triggersStore.fetchTriggers(counterId)
        },
        { fireImmediately: true },
      ),
    ]
  }

  dispose() {
    /** Перестаем следить за реакциями при размонитровании провайдера. */
    this.disposers.forEach((dispose) => dispose())
    this.disposers = []

    this.countersStore.stopPolling()
    this.countersStore.abortPending()
    this.triggersStore.abortPending()
    this.authStore.abortPending()
  }
}
