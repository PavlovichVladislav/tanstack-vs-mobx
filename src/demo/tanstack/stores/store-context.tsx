import { createContext, useContext, useState, type PropsWithChildren } from 'react'

import { TanstackUiStore } from './ui-store'

type TanstackStores = {
  uiStore: TanstackUiStore
}

const TanstackStoresContext = createContext<TanstackStores | null>(null)

export function TanstackStoresProvider({ children }: PropsWithChildren) {
  const [stores] = useState<TanstackStores>(() => ({
    uiStore: new TanstackUiStore(),
  }))

  return (
    <TanstackStoresContext.Provider value={stores}>
      {children}
    </TanstackStoresContext.Provider>
  )
}

function useTanstackStores() {
  const context = useContext(TanstackStoresContext)

  if (!context) {
    throw new Error('useTanstackStores must be used within TanstackStoresProvider')
  }

  return context
}

export function useTanstackUiStore() {
  return useTanstackStores().uiStore
}