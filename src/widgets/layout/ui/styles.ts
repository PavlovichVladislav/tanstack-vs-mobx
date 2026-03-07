export const styles = {
  shell: 'min-h-screen bg-slate-950 text-slate-100',
  header:
    'sticky top-0 z-10 border-b border-slate-800 bg-slate-900/95 backdrop-blur',
  headerInner:
    'mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4',
  brand: 'text-lg font-semibold tracking-tight text-white',
  nav: 'flex items-center gap-2',
  navLink:
    'rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-slate-500 hover:text-white',
  navLinkActive:
    'rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-2 text-sm font-medium text-sky-200',
  main: 'mx-auto max-w-7xl px-6 py-8',
} as const