import { styles } from './styles'

export function MobxDashboardPage() {
  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <h1 className={styles.title}>MobX-only dashboard</h1>
        <p className={styles.text}>
          Здесь будет версия без TanStack Query: stores, ручные loading/error
          состояния, ручной polling и ручная синхронизация после mutations.
        </p>

        <ul className={styles.list}>
          <li>• AuthStore</li>
          <li>• CountersStore</li>
          <li>• TriggersStore</li>
          <li>• UI store</li>
        </ul>
      </section>
    </div>
  )
}