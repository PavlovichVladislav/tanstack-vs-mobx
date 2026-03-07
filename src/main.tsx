import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'

import { router } from '@/app/router/router'
import '@/app/styles/index.css'
import { AppQueryProvider } from './app/providers/query/query-provider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppQueryProvider>
      <RouterProvider router={router} />
    </AppQueryProvider>
  </React.StrictMode>,
)