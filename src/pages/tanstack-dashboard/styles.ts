export const styles = {
  page: 'space-y-6',
  header: 'flex flex-col gap-4 md:flex-row md:items-end md:justify-between',
  headerText: 'space-y-2',
  title: 'text-2xl font-semibold tracking-tight text-white',
  description: 'text-sm leading-6 text-slate-300',
  controls: 'flex flex-col gap-3 md:w-[320px]',
  statusRow: 'flex flex-wrap items-center gap-3',
  status:
    'inline-flex rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs font-medium text-slate-300',
  statusFetching:
    'inline-flex rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-300',
  statusError:
    'inline-flex rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-300',
  grid: 'grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]',
  panelTitle: 'text-sm font-medium uppercase tracking-wide text-slate-400',
  tableWrap: 'overflow-hidden rounded-xl border border-slate-800',
  table: 'min-w-full border-collapse',
  th: 'border-b border-slate-800 bg-slate-950 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400',
  td: 'border-b border-slate-800 px-4 py-3 text-sm text-slate-200',
  tr: 'cursor-pointer transition hover:bg-slate-800/40',
  trActive: 'cursor-pointer bg-sky-500/10 transition hover:bg-sky-500/20',
  empty: 'py-10 text-center text-sm text-slate-400',
  sideList: 'mt-4 space-y-3',
  sideItem: 'rounded-xl border border-slate-800 bg-slate-950 p-4',
  sideLabel: 'text-xs uppercase tracking-wide text-slate-500',
  sideValue: 'mt-2 text-sm text-slate-200',
  mono: 'font-mono text-xs text-slate-400',
} as const