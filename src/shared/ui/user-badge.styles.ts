export const styles = {
  root: 'flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2',
  avatar: 'h-9 w-9 rounded-full border border-slate-700 object-cover',
  fallback:
    'flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-200',
  content: 'min-w-0',
  name: 'truncate text-sm font-medium text-white',
  role: 'text-xs text-slate-400',
  skeleton: 'text-sm text-slate-400',
} as const