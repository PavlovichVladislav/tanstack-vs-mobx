import { observer } from 'mobx-react-lite'

import { useCounters } from '@/demo/tanstack/queries/use-counters'
import {
  TanstackStoresProvider,
  useTanstackUiStore,
} from '@/demo/tanstack/stores/store-context'
import { buttonStyles } from '@/shared/ui/button.styles'
import { cardStyles } from '@/shared/ui/card.styles'
import { inputStyles } from '@/shared/ui/input.styles'

import { styles } from './styles'

const TanstackDashboardContent = observer(() => {
  const uiStore = useTanstackUiStore()

  const countersQuery = useCounters({
    search: uiStore.search,
  })

  const selectedCounter =
    countersQuery.data?.find((counter) => counter.id === uiStore.selectedCounterId) ??
    null

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>TanStack dashboard</h1>
          <p className={styles.description}>
            Первая рабочая версия: search лежит в MobX UI-store, server state —
            в TanStack Query. Дальше сюда добавим summary, details, remove ban,
            triggers и polling comparison.
          </p>
        </div>

        <div className={styles.controls}>
          <input
            value={uiStore.search}
            onChange={(event) => uiStore.setSearch(event.target.value)}
            placeholder="Search counters..."
            className={inputStyles.root}
          />

          <button
            type="button"
            onClick={() => countersQuery.refetch()}
            className={buttonStyles.secondary}
            disabled={countersQuery.isFetching}
          >
            Refresh
          </button>
        </div>
      </section>

      <div className={styles.statusRow}>
        {countersQuery.isLoading && (
          <div className={styles.status}>Initial loading...</div>
        )}

        {countersQuery.isFetching && !countersQuery.isLoading && (
          <div className={styles.statusFetching}>Background fetching...</div>
        )}

        {countersQuery.isError && (
          <div className={styles.statusError}>
            {countersQuery.error instanceof Error
              ? countersQuery.error.message
              : 'Unknown error'}
          </div>
        )}

        <div className={styles.status}>
          Total: {countersQuery.data?.length ?? 0}
        </div>
      </div>

      <div className={styles.grid}>
        <section className={cardStyles.root}>
          <div className={styles.panelTitle}>Counters</div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Name</th>
                  <th className={styles.th}>Current</th>
                  <th className={styles.th}>Limit</th>
                  <th className={styles.th}>Banned</th>
                  <th className={styles.th}>Updated</th>
                </tr>
              </thead>

              <tbody>
                {countersQuery.data?.length ? (
                  countersQuery.data.map((counter) => {
                    const isSelected = counter.id === uiStore.selectedCounterId

                    return (
                      <tr
                        key={counter.id}
                        className={isSelected ? styles.trActive : styles.tr}
                        onClick={() => uiStore.setSelectedCounterId(counter.id)}
                      >
                        <td className={styles.td}>{counter.name}</td>
                        <td className={styles.td}>{counter.currentValue}</td>
                        <td className={styles.td}>{counter.limit}</td>
                        <td className={styles.td}>
                          {counter.isBanned ? 'Yes' : 'No'}
                        </td>
                        <td className={styles.td}>
                          {new Date(counter.updatedAt).toLocaleTimeString()}
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td className={styles.empty} colSpan={5}>
                      {countersQuery.isLoading
                        ? 'Loading...'
                        : 'No counters found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <aside className={cardStyles.root}>
          <div className={styles.panelTitle}>Selection</div>

          <div className={styles.sideList}>
            <div className={styles.sideItem}>
              <div className={styles.sideLabel}>Selected counter</div>
              <div className={styles.sideValue}>
                {selectedCounter?.name ?? 'Nothing selected'}
              </div>
            </div>

            <div className={styles.sideItem}>
              <div className={styles.sideLabel}>Counter id</div>
              <div className={`${styles.sideValue} ${styles.mono}`}>
                {selectedCounter?.id ?? '—'}
              </div>
            </div>

            <div className={styles.sideItem}>
              <div className={styles.sideLabel}>Ban status</div>
              <div className={styles.sideValue}>
                {selectedCounter
                  ? selectedCounter.isBanned
                    ? 'Banned'
                    : 'Active'
                  : '—'}
              </div>
            </div>

            <div className={styles.sideItem}>
              <div className={styles.sideLabel}>Observation</div>
              <div className={styles.sideValue}>
                Sidebar использует тот же query result, без отдельной загрузки и
                без дублирования данных в store.
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
})

export function TanstackDashboardPage() {
  return (
    <TanstackStoresProvider>
      <TanstackDashboardContent />
    </TanstackStoresProvider>
  )
}