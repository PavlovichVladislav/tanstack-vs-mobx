import type { User } from '@/entities/user/types'
import { buttonStyles } from '@/shared/ui/button.styles'
import { inputStyles } from '@/shared/ui/input.styles'
import { UserBadge } from '@/shared/ui/user-badge'
import { styles } from './styles'

type TanstackDashboardHeaderProps = {
  search: string
  isRefreshing: boolean
  user?: User
  isUserLoading?: boolean
  userError?: string | null
  onSearchChange: (value: string) => void
  onRefresh: () => void
}

export function TanstackDashboardHeader({
  search,
  isRefreshing,
  user,
  isUserLoading = false,
  userError = null,
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
        {userError ? <div className={styles.headerError}>{userError}</div> : null}
      </div>

      <div className={styles.headerAside}>
        <UserBadge user={user} isLoading={isUserLoading} />

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
      </div>
    </section>
  )
}
