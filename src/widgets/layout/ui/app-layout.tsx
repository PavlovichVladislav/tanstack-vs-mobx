import type { PropsWithChildren } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'

import { styles } from './styles'

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
        </div>
      </header>

      <main className={styles.main}>{children}</main>
    </div>
  )
}