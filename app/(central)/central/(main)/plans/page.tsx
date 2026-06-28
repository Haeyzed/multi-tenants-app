"use client"

import { PlansProvider } from "@/components/central/components/plans/plans-provider"
import { PlansPrimaryButtons } from "@/components/central/components/plans/plans-primary-buttons"
import { PlansTable } from "@/components/central/components/plans/plans-table"
import { PlansDialogs } from "@/components/central/components/plans/plans-dialogs"

export default function PlansPage() {
  return (
    <PlansProvider>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Plans</h1>
          <PlansPrimaryButtons />
        </div>
        <PlansTable />
        <PlansDialogs />
      </div>
    </PlansProvider>
  )
}
