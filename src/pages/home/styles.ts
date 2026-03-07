export const styles = {
  page: 'space-y-6',
  hero:
    'rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-[0_10px_30px_rgba(0,0,0,0.25)]',
  title: 'text-3xl font-semibold tracking-tight text-white',
  description: 'mt-3 max-w-3xl text-sm leading-6 text-slate-300',
  cards: 'grid gap-4 md:grid-cols-2',
  card:
    'rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.18)]',
  cardTitle: 'text-lg font-medium text-white',
  cardText: 'mt-2 text-sm leading-6 text-slate-300',
  list: 'mt-3 space-y-2 text-sm text-slate-300',
  badge:
    'inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300',
} as const