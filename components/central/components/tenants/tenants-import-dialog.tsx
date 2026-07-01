import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogClose,
} from "@/components/ui/responsive-dialog"
import { Input } from "@/components/ui/input"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { useImportTenants } from "@/hooks/central/use-tenant-query"

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
            Import tenants from an Excel (.xlsx) or CSV file.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <form id="tenants-import-form" onSubmit={form.handleSubmit(onSubmit)}>
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
            {importTenants.isPending && <Loader2 className="size-4 animate-spin" />}
            Import
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
