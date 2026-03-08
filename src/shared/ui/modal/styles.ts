export const styles = {
  overlay:
    'fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm',
  content:
    'w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)]',
  header: 'flex items-start justify-between gap-4',
  title: 'text-lg font-semibold text-white',
  description: 'mt-1 text-sm leading-6 text-slate-300',
  closeButton:
    'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-950 text-slate-300 transition hover:border-slate-500 hover:text-white',
} as const