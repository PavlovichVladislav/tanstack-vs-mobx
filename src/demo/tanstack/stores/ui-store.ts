import { makeAutoObservable } from 'mobx'

export class TanstackUiStore {
  search = ''
  selectedCounterId: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  setSearch(value: string) {
    this.search = value
  }

  setSelectedCounterId(counterId: string | null) {
    this.selectedCounterId = counterId
  }
}