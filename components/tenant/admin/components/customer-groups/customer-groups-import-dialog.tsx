"use client"

import { z } from "zod"
import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
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
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { useImportCustomerGroups } from "@/hooks/tenant/use-customer-group-query"
import { downloadCustomerGroupsImportSample } from "@/lib/services/tenant/customer-group-service"
import { CloudUpload, X } from "lucide-react"

const formSchema = z.object({
  file: z
    .array(z.custom<File>())
    .min(1, "Please upload a file.")
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

type CustomerGroupsImportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-sm text-destructive">{message}</p>
}

export function CustomerGroupsImportDialog({
  open,
  onOpenChange,
}: CustomerGroupsImportDialogProps) {
  const importCustomerGroups = useImportCustomerGroups()
  const [isDownloadingSample, setIsDownloadingSample] = React.useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { file: [] },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const file = values.file[0]
    if (!file) return

    importCustomerGroups.mutate(file, {
      onSuccess: (result) => {
        if ((result.summary.failed ?? 0) > 0) {
          toast.warning(result.message)
        } else {
          toast.success(result.message || "Customer groups imported successfully")
        }
        onOpenChange(false)
        form.reset()
      },
      onError: (error) => {
        toast.error(error.message || "Failed to import customer groups")
      },
    })
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val)
        if (!val) form.reset()
      }}
    >
      <ResponsiveDialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Import Customer Groups</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Import customer groups from an Excel (.xlsx) or CSV file.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <form
          id="customer-groups-import-form"
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
                await downloadCustomerGroupsImportSample("xlsx")
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
            {isDownloadingSample && <Spinner className="mr-2" />}
            Download sample template
          </Button>

          <Field>
            <FieldLabel>File</FieldLabel>
            <FieldContent>
              <Controller
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FileUpload
                    value={field.value}
                    onValueChange={field.onChange}
                    accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
                    maxFiles={1}
                    maxSize={5 * 1024 * 1024}
                    onFileReject={(_, message) => {
                      form.setError("file", {
                        message,
                      })
                    }}
                  >
                    <FileUploadDropzone className="flex-row flex-wrap border-dotted text-center">
                      <CloudUpload className="mr-2 size-4" />
                      Drag and drop or
                      <FileUploadTrigger
                        render={
                          <Button variant="link" size="sm" className="mx-1 p-0">
                            choose file
                          </Button>
                        }
                      />
                      to upload
                    </FileUploadDropzone>

                    <FileUploadList>
                      {field.value?.map((file, index) => (
                        <FileUploadItem key={index} value={file}>
                          <FileUploadItemPreview />
                          <FileUploadItemMetadata />
                          <FileUploadItemDelete
                            render={
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-7"
                              >
                                <X />
                                <span className="sr-only">Delete</span>
                              </Button>
                            }
                          />
                        </FileUploadItem>
                      ))}
                    </FileUploadList>
                  </FileUpload>
                )}
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
            form="customer-groups-import-form"
            disabled={importCustomerGroups.isPending}
          >
            {importCustomerGroups.isPending && <Spinner className="mr-2" />}
            Import
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
