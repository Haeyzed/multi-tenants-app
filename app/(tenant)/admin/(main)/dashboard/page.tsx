import { PageHeader } from "@/components/layout/page-header"

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 sm:gap-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your tenant admin workspace."
      />
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[50vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  )
}
