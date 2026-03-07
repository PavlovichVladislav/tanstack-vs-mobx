import { useEffect, useState } from 'react'

import { countersApi } from '@/shared/api/counters-api'
import type { Counter } from '@/entities/counter/types'
import { ApiError } from '@/shared/api/api-error'

import { styles } from './styles'

export function TanstackDashboardPage() {
  const [data, setData] = useState<Counter[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    async function run() {
      try {
        setIsLoading(true)
        setError(null)

        const response = await countersApi.getList(
          { search: 'rate-limit' },
          controller.signal,
        )

        setData(response)
      } catch (err) {
        if (err instanceof ApiError && err.isAborted) {
          return
        }

        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    void run()

    return () => {
      controller.abort()
    }
  }, [])

  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <h1 className={styles.title}>TanStack dashboard</h1>
        <p className={styles.text}>
          Пока это техническая страница для smoke-test API слоя. Следующим
          шагом сюда подключим QueryClient, query hooks, shared cache и
          mutations.
        </p>
      </section>

      <section className={styles.card}>
        <div className={styles.sectionTitle}>API smoke test</div>

        {isLoading ? (
          <div className={styles.text}>Loading counters...</div>
        ) : error ? (
          <>
            <div className={styles.error}>Request failed</div>
            <pre className={styles.pre}>{error}</pre>
          </>
        ) : (
          <>
            <div className={styles.success}>Request completed</div>
            <pre className={styles.pre}>
              {JSON.stringify(data?.slice(0, 5), null, 2)}
            </pre>
          </>
        )}
      </section>
    </div>
  )
}