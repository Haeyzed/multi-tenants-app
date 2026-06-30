"use client"

import { PlansProvider } from "@/components/central/components/plans/plans-provider"
import { PlansPrimaryButtons } from "@/components/central/components/plans/plans-primary-buttons"
import { PlansTable } from "@/components/central/components/plans/plans-table"
import { PlansDialogs } from "@/components/central/components/plans/plans-dialogs"
import { PageHeader } from "@/components/layout/page-header"

export default function PlansPage() {
  return (
    <PlansProvider>
      <div className="flex flex-1 flex-col gap-4 sm:gap-6">
        <PageHeader
          title="Plans"
          description="Configure subscription plans and pricing for your tenants."
        >
          <PlansPrimaryButtons />
        </PageHeader>
        <PlansTable />
        <PlansDialogs />
      </div>
    </PlansProvider>
  )
}
