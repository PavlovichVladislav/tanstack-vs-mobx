import { useEffect } from 'react'
import { countersApi } from '@/shared/api/counters-api'

export function App() {
  useEffect(() => {
    countersApi.getList({ search: 'rate' }).then(console.log).catch(console.error)
  }, [])

  return <div>App</div>
}