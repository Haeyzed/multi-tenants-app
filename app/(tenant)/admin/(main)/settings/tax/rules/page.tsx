"use client"

import { TaxRulesProvider } from "@/components/tenant/admin/components/tax-rules/tax-rules-provider"
import { TaxRulesPrimaryButtons } from "@/components/tenant/admin/components/tax-rules/tax-rules-primary-buttons"
import { TaxRulesTable } from "@/components/tenant/admin/components/tax-rules/tax-rules-table"
import { TaxRulesDialogs } from "@/components/tenant/admin/components/tax-rules/tax-rules-dialogs"
import { TaxRuleStatistics } from "@/components/tenant/admin/components/tax-rules/tax-rule-statistics"
import { PageHeader } from "@/components/layout/page-header"
import { TenantAdminAuthGuard } from "@/components/tenant/admin/components/auth-guard"

export default function TaxRulesPage() {
  return (
    <TenantAdminAuthGuard permissions="tax.view">
      <TaxRulesProvider>
        <div className="flex flex-1 flex-col gap-4 sm:gap-6">
          <PageHeader
            title="Tax Rules"
            description="Manage tax rules for products and customer groups."
          >
            <TaxRulesPrimaryButtons />
          </PageHeader>
          <TaxRuleStatistics />
          <TaxRulesTable />
          <TaxRulesDialogs />
        </div>
      </TaxRulesProvider>
    </TenantAdminAuthGuard>
  )
}
