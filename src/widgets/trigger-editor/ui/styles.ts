export const styles = {
  form: 'mt-6 space-y-4',
  field: 'space-y-2',
  label: 'block text-sm font-medium text-slate-200',
  row: 'grid gap-4 md:grid-cols-2',
  checkboxRow:
    'flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3',
  checkbox: 'h-4 w-4 rounded border-slate-600 bg-slate-950',
  helper: 'text-xs text-slate-400',
  footer: 'mt-6 flex items-center justify-end gap-3',
  error:
    'rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300',
  meta:
    'rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-slate-400',
} as const