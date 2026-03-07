import type { PropsWithChildren } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'

import { useMe } from '@/demo/tanstack/queries/use-me'
import { styles } from './styles'
import { UserBadge } from '@/shared/ui/user-badge';

function AppNavLink(props: { to: string; label: string }) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  const isActive = pathname === props.to

  return (
    <Link
      to={props.to}
      className={isActive ? styles.navLinkActive : styles.navLink}
    >
      {props.label}
    </Link>
  )
}

export function AppLayout({ children }: PropsWithChildren) {
  const meQuery = useMe()

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>Query vs Store Demo</div>

          <nav className={styles.nav}>
            <AppNavLink to="/" label="Home" />
            <AppNavLink to="/tanstack" label="TanStack" />
            <AppNavLink to="/mobx" label="MobX" />
          </nav>

          <UserBadge user={meQuery.data} isLoading={meQuery.isLoading} />
        </div>
      </header>

      <main className={styles.main}>{children}</main>
    </div>
  )
}