"use client"

import { PlansProvider } from "@/components/central/components/plans/plans-provider"
import { PlansPrimaryButtons } from "@/components/central/components/plans/plans-primary-buttons"
import { PlansTable } from "@/components/central/components/plans/plans-table"
import { PlansDialogs } from "@/components/central/components/plans/plans-dialogs"
import { PlanStatistics } from "@/components/central/components/plans/plan-statistics"
import { PageHeader } from "@/components/layout/page-header"
import { Guard } from "@/components/central/components/auth/guard"

export default function PlansPage() {
  return (
    <Guard permissions="plans.view">
      <PlansProvider>
        <div className="flex flex-1 flex-col gap-4 sm:gap-6">
          <PageHeader
            title="Plans"
            description="Configure subscription plans and pricing for your tenants."
          >
            <PlansPrimaryButtons />
          </PageHeader>
          <PlanStatistics />
          <PlansTable />
          <PlansDialogs />
        </div>
      </PlansProvider>
    </Guard>
  )
}
