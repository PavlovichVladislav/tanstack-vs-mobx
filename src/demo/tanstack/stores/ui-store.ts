import { makeAutoObservable } from 'mobx'

export class TanstackUiStore {
  search = ''
  selectedCounterId: string | null = null
  isTriggerModalOpen = false
  editingTriggerId: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  setSearch(value: string) {
    this.search = value
  }

  setSelectedCounterId(counterId: string | null) {
    this.selectedCounterId = counterId
  }

  openTriggerModal(triggerId: string) {
    this.editingTriggerId = triggerId
    this.isTriggerModalOpen = true
  }

  closeTriggerModal() {
    this.isTriggerModalOpen = false
    this.editingTriggerId = null
  }
}