import { z } from "zod"
import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { Input } from "@/components/ui/input"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { useImportTenants } from "@/hooks/central/use-tenant-query"
import { downloadTenantsImportSample } from "@/lib/services/central/tenant-service"

const formSchema = z.object({
  file: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, {
      message: "Please upload a file.",
    })
    .refine((files) => {
      const file = files?.[0]
      if (!file) return false
      return [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "text/csv",
      ].includes(file.type)
    }, "Please upload an Excel or CSV file."),
})

type TenantsImportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-sm text-destructive">{message}</p>
}

export function TenantsImportDialog({
  open,
  onOpenChange,
}: TenantsImportDialogProps) {
  const importTenants = useImportTenants()
  const [isDownloadingSample, setIsDownloadingSample] = React.useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { file: undefined },
  })

  const fileRef = form.register("file")

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const file = values.file[0]
    if (!file) return

    importTenants.mutate(file, {
      onSuccess: () => {
        toast.success("Tenants imported successfully")
        onOpenChange(false)
        form.reset()
      },
      onError: (error) => {
        toast.error(error.message || "Failed to import tenants")
      },
    })
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val)
        form.reset()
      }}
    >
      <ResponsiveDialogContent className="sm:max-w-sm">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Import Tenants</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Import tenants from Excel or CSV. Each row provisions a tenant with
            database, domain, and owner account (same as Create Tenant).
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <form
          id="tenants-import-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={isDownloadingSample}
            onClick={async () => {
              setIsDownloadingSample(true)
              try {
                await downloadTenantsImportSample("xlsx")
                toast.success("Sample template downloaded")
              } catch (error) {
                toast.error(
                  error instanceof Error
                    ? error.message
                    : "Failed to download sample template"
                )
              } finally {
                setIsDownloadingSample(false)
              }
            }}
          >
            {isDownloadingSample && <Spinner />}
            Download sample template
          </Button>
          <Field>
            <FieldLabel>File</FieldLabel>
            <FieldContent>
              <Input
                type="file"
                accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
                {...fileRef}
                className="h-8 py-0"
              />
              <FieldError message={form.formState.errors.file?.message} />
            </FieldContent>
          </Field>
        </form>
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">Close</Button>}
          />
          <Button
            type="submit"
            form="tenants-import-form"
            disabled={importTenants.isPending}
          >
            {importTenants.isPending && <Spinner />}
            Import
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
