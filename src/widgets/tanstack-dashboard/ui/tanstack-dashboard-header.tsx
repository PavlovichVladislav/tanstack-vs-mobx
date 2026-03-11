import { buttonStyles } from '@/shared/ui/button.styles'
import { inputStyles } from '@/shared/ui/input.styles'
import { styles } from './styles'

type TanstackDashboardHeaderProps = {
  search: string
  isRefreshing: boolean
  onSearchChange: (value: string) => void
  onRefresh: () => void
}

export function TanstackDashboardHeader({
  search,
  isRefreshing,
  onSearchChange,
  onRefresh,
}: TanstackDashboardHeaderProps) {
  return (
    <section className={styles.header}>
      <div className={styles.headerText}>
        <h1 className={styles.title}>TanStack dashboard</h1>
        <p className={styles.description}>
          Search и selected state лежат в MobX UI-store, а counters / details /
          triggers — в TanStack Query. Для trigger update используем mutation с
          точечным обновлением query cache.
        </p>
      </div>

      <div className={styles.controls}>
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search counters..."
          className={inputStyles.root}
        />

        <button
          type="button"
          onClick={onRefresh}
          className={buttonStyles.secondary}
          disabled={isRefreshing}
        >
          Refresh
        </button>
      </div>
    </section>
  )
}