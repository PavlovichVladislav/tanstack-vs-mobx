import { buttonStyles } from '@/shared/ui/button.styles'
import { inputStyles } from '@/shared/ui/input.styles'
import { styles } from './styles'

type MobxDashboardHeaderProps = {
  search: string
  isRefreshing: boolean
  onSearchChange: (value: string) => void
  onRefresh: () => void
}

export function MobxDashboardHeader({
  search,
  isRefreshing,
  onSearchChange,
  onRefresh,
}: MobxDashboardHeaderProps) {
  return (
    <section className={styles.header}>
      <div className={styles.headerText}>
        <h1 className={styles.title}>MobX-only dashboard</h1>
        <p className={styles.description}>
          Здесь server state хранится в сторах: counters, selected counter,
          triggers, loading/error/fetching и polling управляются вручную.
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