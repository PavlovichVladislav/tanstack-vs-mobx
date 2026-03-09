import { AuthStore } from './auth-store'
import { CountersStore } from './counters-store'
import { TriggersStore } from './triggers-store'
import { MobxUiStore } from './ui-store'

export class MobxRootStore {
  authStore: AuthStore
  countersStore: CountersStore
  triggersStore: TriggersStore
  uiStore: MobxUiStore

  constructor() {
    this.authStore = new AuthStore()
    this.countersStore = new CountersStore()
    this.triggersStore = new TriggersStore()
    this.uiStore = new MobxUiStore()
  }
}