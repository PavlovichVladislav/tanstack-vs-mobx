import { styles } from './styles'

export function HomePage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.badge}>Admin panel demo</div>
        <h1 className={styles.title}>TanStack Query vs MobX-only</h1>
        <p className={styles.description}>
          Сравнительный демо-проект для панели управления счётчиками блокировок
          и триггерами. Оба режима используют один и тот же backend, один общий
          API client и общий UI. Отличается только способ управления server
          state.
        </p>
      </section>

      <section className={styles.cards}>
        <article className={styles.card}>
          <h2 className={styles.cardTitle}>Что сравниваем</h2>
          <div className={styles.cardText}>
            Показываем разницу между подходами:
          </div>
          <ul className={styles.list}>
            <li>• shared cache между компонентами</li>
            <li>• invalidation после mutation</li>
            <li>• polling / background refresh</li>
            <li>• loading / fetching lifecycle</li>
            <li>• ручная sync логика в store-подходе</li>
          </ul>
        </article>

        <article className={styles.card}>
          <h2 className={styles.cardTitle}>Роуты</h2>
          <div className={styles.cardText}>
            Используем TanStack Router как современную типобезопасную основу для
            dashboard-приложения.
          </div>
          <ul className={styles.list}>
            <li>• /tanstack — версия с TanStack Query</li>
            <li>• /mobx — версия с MobX-only</li>
          </ul>
        </article>
      </section>
    </div>
  )
}