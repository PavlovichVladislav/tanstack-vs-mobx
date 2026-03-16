# Walkthrough для design review: MobX-only vs TanStack Query + MobX

## Введение

Цель этого walkthrough:

- пройтись по demo-проекту прямо по коду
- сравнить два подхода к управлению состоянием в admin panel
- понять, оправдан ли переход на TanStack Query для server state

Что сравниваем:

1. `MobX-only`
2. `TanStack Query для server state + MobX для UI/domain state`

Что не сравниваем:

- визуальный UI
- бизнес часть (логика придумана)
- роутинг
- стилизацию

Все это в демо специально выровнено, чтобы сравнение было именно архитектурным.

Что важно проговорить команде в начале:

- это не презентация “новый инструмент лучше, потому что новый”
- задача сравнения: понять, где реально снижается инженерная сложность, а где разница минимальна
- если где-то MobX выглядит проще и понятнее, это нужно проговорить честно

Вопрос команде в начале:

- “Мы хотим выбрать универсальный стандарт для всех экранов?”

---

## Что именно мы сравниваем

### Какие файлы открыть

- [src/pages/mobx-dashboard/page.tsx](../src/pages/mobx-dashboard/page.tsx)
- [src/pages/tanstack-dashboard/page.tsx](../src/pages/tanstack-dashboard/page.tsx)
- [src/widgets/mobx-dashboard/ui/mobx-dashboard-content.tsx](../src/widgets/mobx-dashboard/ui/mobx-dashboard-content.tsx)
- [src/widgets/tanstack-dashboard/ui/tanstack-dashboard-content.tsx](../src/widgets/tanstack-dashboard/ui/tanstack-dashboard-content.tsx)
- [src/shared/api/counters-api.ts](../src/shared/api/counters-api.ts)
- [src/shared/api/triggers-api.ts](../src/shared/api/triggers-api.ts)
- [src/shared/api/auth-api.ts](../src/shared/api/auth-api.ts)

### Что показать в коде

- обе страницы используют один и тот же backend и один и тот же API layer
- различается не transport и не UI, а способ управления server state
- компонентная декомпозиция у веток одинаковая

### Что объяснить команде

- сравнение честное, потому что product scope одинаков
- API одинаковый, сценарии одинаковые, UI одинаковый
- меняется только стратегия владения данными

### На какие различия обратить внимание

- в `MobX` orchestration собран вокруг stores и `useEffect`
- в `TanStack` orchestration частично переносится в query/mutation hooks и его встроенный cache

Что сказать:

- “Здесь важно смотреть не на количество строк, а на то, где живет ответственность за server state”

Вопрос команде:

- “Что для нас важнее как baseline: явный orchestration в stores или специализированный слой для server state?”

Возможное возражение:

- “Но UI-то одинаковый, значит разницы почти нет”

Что ответить:

- “UI одинаковый специально; сравниваем не внешний результат, а стоимость реализации и поддержки”

---

## Архитектура MobX-only реализации

### Какие файлы открыть

- [src/demo/mobx/stores/root-store.ts](../src/demo/mobx/stores/root-store.ts)
- [src/demo/mobx/stores/store-context.tsx](../src/demo/mobx/stores/store-context.tsx)
- [src/demo/mobx/stores/ui-store.ts](../src/demo/mobx/stores/ui-store.ts)
- [src/demo/mobx/stores/auth-store.ts](../src/demo/mobx/stores/auth-store.ts)
- [src/demo/mobx/stores/counters-store.ts](../src/demo/mobx/stores/counters-store.ts)
- [src/demo/mobx/stores/triggers-store.ts](../src/demo/mobx/stores/triggers-store.ts)
- [src/widgets/mobx-dashboard/ui/mobx-dashboard-content.tsx](../src/widgets/mobx-dashboard/ui/mobx-dashboard-content.tsx)

### Что показать в коде

- root store собирает все stores
- UI state и server state живут в MobX
- управление жизненным циклом данных на уровне страницы происходит через `useEffect`
- stores содержат и данные, и loading/error/fetching флаги, и mutation logic, и polling logic

### Что объяснить команде

- это очень знакомая для команды модель
- все выглядит явно: store хранит данные и умеет их загружать/обновлять
- orchestration можно читать почти линейно

### На какие различия обратить внимание

- в `counters-store` уже есть инфраструктура для:
  - list loading
  - background fetching
  - details loading
  - polling
  - mutation sync (перезапрос данных после их обновления)
  - abort/cancellation guards
- в `triggers-store` отдельно хранится cache по `counterId`

Что сказать:

- “MobX-only здесь не примитивный; это уже попытка построить свой server-state layer поверх stores”

Где MobX выглядит сильнее:

- flow читается линейно
- легче объяснить junior/middle разработчику
- явный store API: `fetchCounters`, `fetchCounter`, `removeBan`, `fetchTriggers`, `updateTrigger`

Где возможны проблемы:

- инфраструктурный код быстро растет
- жизненный цикл запроса описываем вручную (loading, fetching, error, abort, polling, кэш реализовываем руками в triggers). Местами начинается расхождения в подходах (где - то один loading на все запросы, где то кастомный polling(хуком или в сторе)). Танстак же дает стандартный ЖЦ запроса, который контролируется хуком, бонусом получаем дудпликацию, рефетч, полинг через декларативные настройки. У запрос централизованный кэш. Также бонусом - реатри, которые обычно и не делаем. На аутхе они стрельнут в ногу, а вот во всяких местах, где что - то может моргнуть - норм история сделать ретрай и не заставлять чела жать ф5
- чем больше экранов и shared data, тем больше риск расхождения patterns. refetchOnWindowFocus

Трейд оф такой, что надо правильно управлять queryKey, управлять стратегий после мутации setQueryData или invalidateQueries. Бизнес оркестрация остается в mobx (searchValue, isEditModalOpen)

Танстак сильно снижают долю ручной инфраструктры.

Вопрос команде:

- “Если мы остаемся на MobX-only, готовы ли мы договориться о строгом шаблоне для async/server state stores?”

Возможное возражение:

- “Но зато все явно, без магии”

Что ответить:

- “Да, и это реальный плюс MobX-only. Вопрос только в том, готовы ли мы вручную поддерживать всю инфраструктуру на десятках экранов”

---

## Архитектура TanStack реализации

### Какие файлы открыть

- [src/app/providers/query/query-client.ts](../src/app/providers/query/query-client.ts)
- [src/app/providers/query/query-provider.tsx](../src/app/providers/query/query-provider.tsx)
- [src/demo/tanstack/query-keys.ts](../src/demo/tanstack/query-keys.ts)
- [src/demo/tanstack/stores/ui-store.ts](../src/demo/tanstack/stores/ui-store.ts)
- [src/demo/tanstack/queries/use-me.ts](../src/demo/tanstack/queries/use-me.ts)
- [src/demo/tanstack/queries/use-counters.ts](../src/demo/tanstack/queries/use-counters.ts)
- [src/demo/tanstack/queries/use-counter.ts](../src/demo/tanstack/queries/use-counter.ts)
- [src/demo/tanstack/queries/use-triggers.ts](../src/demo/tanstack/queries/use-triggers.ts)
- [src/demo/tanstack/mutations/use-remove-ban.ts](../src/demo/tanstack/mutations/use-remove-ban.ts)
- [src/demo/tanstack/mutations/use-update-trigger.ts](../src/demo/tanstack/mutations/use-update-trigger.ts)
- [src/widgets/tanstack-dashboard/ui/tanstack-dashboard-content.tsx](../src/widgets/tanstack-dashboard/ui/tanstack-dashboard-content.tsx)

### Что показать в коде

- MobX остался только для UI state
- server state живет в query cache
- query hooks описывают чтение данных
- mutation hooks описывают обновление данных
- `queryClient` задает общую политику для retry/staleTime/gc

### Что объяснить команде

- это не “React hooks вместо stores”, а другой ownership model для server state
- screen container сам хранит меньше инфраструктурной логики
- часть orchestration уходит в query cache и policy

### На какие различия обратить внимание

- query hooks используются в нескольких местах без отдельного проброса данных сверху
- mutation flow описывается через cache update / invalidation
- loading/fetching semantics уже встроены в модель

Что сказать:

- “TanStack здесь не делает код автоматически проще в каждом файле, но снимает слой повторяемой server-state логики”

Где TanStack выглядит сильнее:

- shared cache
- единая lifecycle-модель
- меньше ручного cache orchestration

Где TanStack выглядит слабее или сложнее:

- выше порог входа
- data flow менее линейный
- нужно понимать query keys, invalidation, query cache semantics

Вопрос команде:

- “Для нас важнее локальная явность в одном store или единый стандартизированный lifecycle server state?”

Возможное возражение:

- “Тут часть сложности просто спрятана в библиотеку”

Что ответить:

- “Да, и это честное замечание. Вопрос в том, хотим ли мы продолжать писать эту инфраструктуру сами”

---

## Пошаговое сравнение ключевых сценариев

## Сценарий 1. Загрузка списка counters

### Какие файлы открыть

- MobX:
  - [src/demo/mobx/stores/counters-store.ts](../src/demo/mobx/stores/counters-store.ts)
  - [src/widgets/mobx-dashboard/ui/mobx-dashboard-content.tsx](../src/widgets/mobx-dashboard/ui/mobx-dashboard-content.tsx)
  - [src/widgets/mobx-dashboard/ui/mobx-counters-section.tsx](../src/widgets/mobx-dashboard/ui/mobx-counters-section.tsx)
- TanStack:
  - [src/demo/tanstack/queries/use-counters.ts](../src/demo/tanstack/queries/use-counters.ts)
  - [src/widgets/tanstack-dashboard/ui/tanstack-dashboard-content.tsx](../src/widgets/tanstack-dashboard/ui/tanstack-dashboard-content.tsx)
  - [src/widgets/tanstack-dashboard/ui/tanstack-counters-section.tsx](../src/widgets/tanstack-dashboard/ui/tanstack-counters-section.tsx)

### MobX-only: как реализовано

- page/container через `useEffect` вызывает `fetchCounters`
- store сам управляет запросом, флагами и обновлением списка
- UI читает готовый observable state из store

### MobX-only: какие проблемы возникают

- orchestration надо писать вручную
- lifecycle list loading/fetching надо проектировать вручную
- cancellation/stale result guard надо писать вручную

### MobX-only: сколько инфраструктурного кода требуется

- store method
- несколько флагов
- useEffect для запуска
- guards against stale requests

### TanStack: как реализовано

- `useCounters` описывает query
- компонент получает `data/isLoading/isFetching/isError`
- cache ownership лежит в TanStack Query

### TanStack: что упрощается

- меньше screen-level orchestration
- меньше ручного lifecycle plumbing
- policy по stale/refetch живет централизованно

### TanStack: какие trade-offs появляются

- нужно понимать query key
- загрузка списка “размазана” между hook и потребителями
- не всем будет так же легко читать flow, как в store action

Что сказать:

- “На простом сценарии разница уже видна: MobX делает все явно, TanStack делает меньше вручную”

Вопрос команде:

- “Нам важнее явный flow или уменьшение повторяемого async boilerplate?”

---

## Сценарий 2. Loading / error состояния

### Какие файлы открыть

- MobX:
  - [src/demo/mobx/stores/auth-store.ts](../src/demo/mobx/stores/auth-store.ts)
  - [src/demo/mobx/stores/counters-store.ts](../src/demo/mobx/stores/counters-store.ts)
  - [src/demo/mobx/stores/triggers-store.ts](../src/demo/mobx/stores/triggers-store.ts)
  - [src/widgets/mobx-dashboard/ui/mobx-dashboard-status-row.tsx](../src/widgets/mobx-dashboard/ui/mobx-dashboard-status-row.tsx)
- TanStack:
  - [src/demo/tanstack/queries/use-me.ts](../src/demo/tanstack/queries/use-me.ts)
  - [src/demo/tanstack/queries/use-counters.ts](../src/demo/tanstack/queries/use-counters.ts)
  - [src/demo/tanstack/queries/use-counter.ts](../src/demo/tanstack/queries/use-counter.ts)
  - [src/demo/tanstack/queries/use-triggers.ts](../src/demo/tanstack/queries/use-triggers.ts)
  - [src/widgets/tanstack-dashboard/ui/tanstack-dashboard-status-row.tsx](../src/widgets/tanstack-dashboard/ui/tanstack-dashboard-status-row.tsx)

### MobX-only: как реализовано

- флаги и ошибки лежат в каждом store
- UI читает нужные поля напрямую

### MobX-only: какие проблемы возникают

- lifecycle-флаги приходится определять и поддерживать вручную
- naming и semantics могут начать расходиться между stores и экранами

### MobX-only: сколько инфраструктурного кода требуется

- отдельные флаги
- отдельные поля ошибок
- сбросы/установка в каждом async method

### TanStack: как реализовано

- query already exposes lifecycle flags
- UI читает единый query contract

### TanStack: что упрощается

- меньше ручных флагов в каждом resource owner
- более единый mental model

### TanStack: какие trade-offs появляются

- нужно понимать различие `isLoading` / `isFetching`
- состояние уже не лежит в одном явном store-объекте

Что сказать:

- “MobX здесь не хуже концептуально, но сильно зависит от дисциплины команды”

Вопрос команде:

- “Если мы остаемся на MobX-only, сможем ли мы обеспечить одинаковую lifecycle semantics во всех stores?”

---

## Сценарий 3. Shared data между компонентами

### Какие файлы открыть

- MobX:
  - [src/widgets/mobx-dashboard/ui/mobx-counters-section.tsx](../src/widgets/mobx-dashboard/ui/mobx-counters-section.tsx)
  - [src/widgets/mobx-dashboard/ui/mobx-summary-sidebar.tsx](../src/widgets/mobx-dashboard/ui/mobx-summary-sidebar.tsx)
  - [src/widgets/mobx-dashboard/ui/mobx-triggers-section.tsx](../src/widgets/mobx-dashboard/ui/mobx-triggers-section.tsx)
  - [src/features/edit-trigger/ui/mobx-edit-trigger-modal-container.tsx](../src/features/edit-trigger/ui/mobx-edit-trigger-modal-container.tsx)
- TanStack:
  - [src/widgets/tanstack-dashboard/ui/tanstack-counters-section.tsx](../src/widgets/tanstack-dashboard/ui/tanstack-counters-section.tsx)
  - [src/widgets/tanstack-dashboard/ui/tanstack-summary-sidebar.tsx](../src/widgets/tanstack-dashboard/ui/tanstack-summary-sidebar.tsx)
  - [src/widgets/tanstack-dashboard/ui/tanstack-triggers-section.tsx](../src/widgets/tanstack-dashboard/ui/tanstack-triggers-section.tsx)
  - [src/features/edit-trigger/ui/edit-trigger-modal-container.tsx](../src/features/edit-trigger/ui/edit-trigger-modal-container.tsx)

### MobX-only: как реализовано

- shared data живет в stores
- несколько компонентов читают один и тот же observable state

### MobX-only: какие проблемы возникают

- кто владеет server resource и когда его грузить, нужно решать вручную
- store быстро становится “центром всего”

### MobX-only: сколько инфраструктурного кода требуется

- store ownership
- orchestration загрузки
- методы доступа к данным

### TanStack: как реализовано

- несколько компонентов могут вызывать одни и те же query hooks
- данные берутся из shared cache

### TanStack: что упрощается

- нет необходимости делать отдельный store только ради второго/третьего consumer
- легче разносить чтение данных по независимым компонентам

### TanStack: какие trade-offs появляются

- чтение одного ресурса происходит “из разных мест”
- без знакомства с Query может показаться, что компонент “сам заново фетчит”

Что сказать:

- “Это один из самых сильных аргументов в пользу TanStack: shared data reuse без ручного cache/store glue”

Вопрос команде:

- “У нас много экранов, где одни и те же server данные читаются в нескольких виджетах?”

Возможное возражение:

- “Мы и в MobX можем просто дать всем доступ к store”

Что ответить:

- “Да, можем. Но тогда нам нужно еще вручную решать вопросы ownership, refresh policy и cache lifecycle”

---

## Сценарий 4. Background fetching / polling

### Какие файлы открыть

- MobX:
  - [src/demo/mobx/stores/counters-store.ts](../src/demo/mobx/stores/counters-store.ts)
  - [src/widgets/mobx-dashboard/ui/mobx-dashboard-content.tsx](../src/widgets/mobx-dashboard/ui/mobx-dashboard-content.tsx)
  - [src/widgets/mobx-dashboard/ui/mobx-dashboard-status-row.tsx](../src/widgets/mobx-dashboard/ui/mobx-dashboard-status-row.tsx)
- TanStack:
  - [src/demo/tanstack/queries/use-counters.ts](../src/demo/tanstack/queries/use-counters.ts)
  - [src/widgets/tanstack-dashboard/ui/tanstack-dashboard-status-row.tsx](../src/widgets/tanstack-dashboard/ui/tanstack-dashboard-status-row.tsx)

### MobX-only: как реализовано

- polling запускается вручную через `setInterval`
- store хранит timer id
- store различает initial load и background fetch
- на unmount руками останавливается polling и pending requests

### MobX-only: какие проблемы возникают

- polling lifecycle полностью ручной
- нужен cleanup
- нужен explicit contract вокруг `isLoading/isFetching`

### MobX-only: сколько инфраструктурного кода требуется

- timer management
- state flags
- cleanup logic
- stale request protection

### TanStack: как реализовано

- polling задается через `refetchInterval`
- lifecycle already integrated into query model

### TanStack: что упрощается

- нет ручного timer management на screen level
- background refetch естественно встроен в lifecycle

### TanStack: какие trade-offs появляются

- логика менее явна в UI-контейнере
- behavior задается декларативно, а не через явный imperative flow

Что сказать:

- “Это сценарий, где TanStack выигрывает особенно заметно: polling в MobX быстро превращается в инфраструктуру”

Вопрос команде:

- “Сколько наших admin screens живут с background refresh или периодическим refetch?”

---

## Сценарий 5. Mutation: remove ban / update trigger

### Какие файлы открыть

- MobX:
  - [src/demo/mobx/stores/counters-store.ts](../src/demo/mobx/stores/counters-store.ts)
  - [src/demo/mobx/stores/triggers-store.ts](../src/demo/mobx/stores/triggers-store.ts)
  - [src/widgets/mobx-dashboard/ui/mobx-dashboard-content.tsx](../src/widgets/mobx-dashboard/ui/mobx-dashboard-content.tsx)
- TanStack:
  - [src/demo/tanstack/mutations/use-remove-ban.ts](../src/demo/tanstack/mutations/use-remove-ban.ts)
  - [src/demo/tanstack/mutations/use-update-trigger.ts](../src/demo/tanstack/mutations/use-update-trigger.ts)
  - [src/widgets/tanstack-dashboard/ui/tanstack-dashboard-content.tsx](../src/widgets/tanstack-dashboard/ui/tanstack-dashboard-content.tsx)

### MobX-only: как реализовано

- mutation methods живут в stores
- store после ответа вручную обновляет affected data
- UI вызывает явные store actions

### MobX-only: какие проблемы возникают

- надо помнить, какие куски state надо синхронизировать после mutation
- при росте связности экранов mutation sync усложняется

### MobX-only: сколько инфраструктурного кода требуется

- mutation action
- loading/error state
- ручное обновление связанных данных

### TanStack: как реализовано

- mutation hook описывает server update
- после success делается cache update или invalidation

### TanStack: что упрощается

- mutation lifecycle унифицируется
- работа с последствиями mutation укладывается в один cache contract

### TanStack: какие trade-offs появляются

- нужно понимать, когда делать `setQueryData`, а когда `invalidateQueries`
- mutation logic переезжает из store API в query/mutation layer

Что сказать:

- “TanStack не убирает сложность mutations полностью, но делает ее более типовой и предсказуемой”

Вопрос команде:

- “Где нам проще поддерживать mutation semantics: в ручной store sync логике или в едином cache contract?”

Возможное возражение:

- “setQueryData / invalidateQueries тоже надо уметь готовить”

Что ответить:

- “Да, это реальный trade-off. Но это один общий паттерн, а не отдельный ручной sync-подход на каждый store”

---

## Сценарий 6. Синхронизация данных после mutation

### Какие файлы открыть

- MobX:
  - [src/demo/mobx/stores/counters-store.ts](../src/demo/mobx/stores/counters-store.ts)
  - [src/demo/mobx/stores/triggers-store.ts](../src/demo/mobx/stores/triggers-store.ts)
- TanStack:
  - [src/demo/tanstack/mutations/use-remove-ban.ts](../src/demo/tanstack/mutations/use-remove-ban.ts)
  - [src/demo/tanstack/mutations/use-update-trigger.ts](../src/demo/tanstack/mutations/use-update-trigger.ts)

### MobX-only: как реализовано

- store вручную обновляет локальные структуры после ответа сервера
- например, list и selected entity нужно держать согласованными

### MobX-only: какие проблемы возникают

- чем больше representations одного и того же ресурса, тем выше риск забыть синхронизацию
- логика sync начинает дублироваться

### TanStack: как реализовано

- synchronization идет через query cache
- update/invalidation описывает, что именно стало неактуальным

### TanStack: что упрощается

- меньше ручной связанности между list/details/related data
- проще мыслить категориями cache ownership

### TanStack: какие trade-offs появляются

- нужно аккуратно проектировать query keys
- возможны ошибки в invalidation strategy

Что сказать:

- “Это не та область, где TanStack все делает магически. Но это область, где он дает общий язык для синхронизации”

---

## Сценарий 7. Архитектура компонентов

### Какие файлы открыть

- MobX:
  - [src/widgets/mobx-dashboard/ui/mobx-dashboard-content.tsx](../src/widgets/mobx-dashboard/ui/mobx-dashboard-content.tsx)
  - [src/widgets/mobx-dashboard/ui/mobx-summary-sidebar.tsx](../src/widgets/mobx-dashboard/ui/mobx-summary-sidebar.tsx)
  - [src/features/edit-trigger/ui/mobx-edit-trigger-modal-container.tsx](../src/features/edit-trigger/ui/mobx-edit-trigger-modal-container.tsx)
- TanStack:
  - [src/widgets/tanstack-dashboard/ui/tanstack-dashboard-content.tsx](../src/widgets/tanstack-dashboard/ui/tanstack-dashboard-content.tsx)
  - [src/widgets/tanstack-dashboard/ui/tanstack-summary-sidebar.tsx](../src/widgets/tanstack-dashboard/ui/tanstack-summary-sidebar.tsx)
  - [src/features/edit-trigger/ui/edit-trigger-modal-container.tsx](../src/features/edit-trigger/ui/edit-trigger-modal-container.tsx)

### MobX-only: как реализовано

- container orchestrates flows через stores
- child-компоненты чаще выступают как consumers готового store state

### MobX-only: какие проблемы возникают

- container/store orchestration растет вместе со сценарием
- store постепенно становится “источником всего”

### TanStack: как реализовано

- child-компоненты сами читают нужные ресурсы через hooks
- container меньше управляет data distribution

### TanStack: что упрощается

- меньше prop drilling данных
- легче делать независимые data-aware widgets

### TanStack: какие trade-offs появляются

- data flow становится менее централизованным
- новичку сложнее понять, откуда именно пришли данные

Что сказать:

- “Здесь нет абсолютного победителя: MobX часто проще читать централизованно, TanStack легче масштабировать по независимым виджетам”

Вопрос команде:

- “Для наших админок что типичнее: один централизованный screen flow или набор независимых data-driven panels?”

---

## Итоговое заключение

### Что сказать в финале

Если смотреть на этот demo инженерно честно, вывод такой:

- `TanStack Query + MobX` лучше подходит как стандарт по умолчанию для admin panels с выраженным server state
- `MobX-only` остается разумным и иногда более простым выбором для небольших, локальных и менее связанных экранов

Главный аргумент в пользу TanStack Query:

- он снимает не бизнес-сложность, а повторяемую инфраструктурную сложность вокруг server state

Главный аргумент в пользу MobX-only:

- он более явный, линейный и понятный локально

### Когда стоит использовать TanStack Query

- много server-state-heavy экранов
- shared data между несколькими виджетами
- polling / background refresh
- частые mutations и refetch
- команда хочет стандартизировать server-state layer

### Когда MobX-only остается разумным выбором

- экран маленький и локальный
- мало shared data
- почти нет сложного refetch/update lifecycle
- важнее локальная явность, чем общий cache contract

### Рекомендация для admin panel такого типа

Рекомендуемый baseline:

- `TanStack Query для server state`
- `MobX для UI/domain state`

Но не как абсолютный запрет на MobX-only, а как стандарт по умолчанию для data-heavy admin screens.

Финальный вопрос команде:

- “Мы хотим сохранить локальную свободу выбора подхода или нам важнее получить единый и предсказуемый стандарт для server state в админках?”

---

## Короткий финальный тезис для закрытия презентации

“Если смотреть не на модность, а на стоимость поддержки, TanStack Query в админках такого типа выигрывает прежде всего как стандартизированный слой для server state. MobX-only при этом не теряет ценность, но становится скорее осознанным выбором для простых и локальных экранов, а не универсальным default-подходом.”
