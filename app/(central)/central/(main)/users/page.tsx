"use client"

import { UsersProvider } from "@/components/central/components/users/users-provider"
import { UsersPrimaryButtons } from "@/components/central/components/users/users-primary-buttons"
import { UsersTable } from "@/components/central/components/users/users-table"
import { UsersDialogs } from "@/components/central/components/users/users-dialogs"
import { UserStatistics } from "@/components/central/components/users/user-statistics"
import { PageHeader } from "@/components/layout/page-header"

export default function UsersPage() {
  return (
    <UsersProvider>
      <div className="flex flex-1 flex-col gap-4 sm:gap-6">
        <PageHeader
          title="Users"
          description="Manage central platform administrator accounts."
        >
          <UsersPrimaryButtons />
        </PageHeader>
        <UserStatistics />
        <UsersTable />
        <UsersDialogs />
      </div>
    </UsersProvider>
  )
}
