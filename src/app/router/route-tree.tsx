import { createRootRoute, createRoute, Outlet } from '@tanstack/react-router'

import { AppLayout } from '@/widgets/layout/ui/app-layout'
import { HomePage } from '@/pages/home/page'
import { TanstackDashboardPage } from '@/pages/tanstack-dashboard/page'
import { MobxDashboardPage } from '@/pages/mobx-dashboard/page'

export const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
})

export const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

export const tanstackDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tanstack',
  component: TanstackDashboardPage,
})

export const mobxDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mobx',
  component: MobxDashboardPage,
})

export const routeTree = rootRoute.addChildren([
  homeRoute,
  tanstackDashboardRoute,
  mobxDashboardRoute,
])