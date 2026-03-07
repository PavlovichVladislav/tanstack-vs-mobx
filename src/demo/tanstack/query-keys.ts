export const tanstackQueryKeys = {
  me: () => ['me'] as const,
  counters: (search: string) => ['counters', { search }] as const,
  counter: (counterId: string) => ['counter', counterId] as const,
  triggers: (counterId: string) => ['triggers', counterId] as const,
}