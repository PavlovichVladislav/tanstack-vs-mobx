import { TanstackStoresProvider } from '@/demo/tanstack/stores/store-context'
import { TanstackDashboardContent } from '@/widgets/tanstack-dashboard/ui/tanstack-dashboard-content'

export function TanstackDashboardPage() {
  return (
    <TanstackStoresProvider>
      <TanstackDashboardContent />
    </TanstackStoresProvider>
  )
}