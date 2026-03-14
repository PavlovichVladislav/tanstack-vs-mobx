import { MobxStoresProvider } from '@/demo/mobx/stores/store-context'
import { MobxDashboardContent } from '@/widgets/mobx-dashboard/ui/mobx-dashboard-content'

export function MobxDashboardPage() {
  return (
    <MobxStoresProvider>
      <MobxDashboardContent />
    </MobxStoresProvider>
  )
}