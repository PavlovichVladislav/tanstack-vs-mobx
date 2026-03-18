import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react'

import { MobxRootStore } from './root-store'

const MobxStoresContext = createContext<MobxRootStore | null>(null)

export function MobxStoresProvider({ children }: PropsWithChildren) {
  const [store] = useState(() => new MobxRootStore())

  useEffect(() => {
    store.start()

    return () => {
      store.dispose()
    }
  }, [store])

  return (
    <MobxStoresContext.Provider value={store}>
      {children}
    </MobxStoresContext.Provider>
  )
}

function useMobxRootStore() {
  const context = useContext(MobxStoresContext)

  if (!context) {
    throw new Error('useMobxRootStore must be used within MobxStoresProvider')
  }

  return context
}

export function useMobxStores() {
  return useMobxRootStore()
}
