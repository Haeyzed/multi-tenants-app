"use client"

import { toastApiError, toastApiSuccess } from "@/lib/toast-api"
import { z } from "zod"
import * as React from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { useImportTaxRates } from "@/hooks/tenant/use-tax-rate-query"
import { downloadTaxRatesImportSample } from "@/lib/services/tenant/tax-rate-service"
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

type TaxRatesImportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-sm text-destructive">{message}</p>
}

export function TaxRatesImportDialog({
  open,
  onOpenChange,
}: TaxRatesImportDialogProps) {
  const importTaxRates = useImportTaxRates()
  const [isDownloadingSample, setIsDownloadingSample] = React.useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { file: [] },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const file = values.file[0]
    if (!file) return

    importTaxRates.mutate(file, {
      onSuccess: (result) => {
        toastApiSuccess(result.message, "Tax rates imported successfully")
        onOpenChange(false)
        form.reset()
      },
      onError: (error) => toastApiError(error, "Failed to import tax rates"),
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
          <ResponsiveDialogTitle>Import Tax Rates</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Import tax rates from an Excel (.xlsx) or CSV file.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <form
          id="tax-rates-import-form"
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
                await downloadTaxRatesImportSample("xlsx")
                toastApiSuccess(null, "Sample template downloaded")
              } catch (error) {
                toastApiError(error, "Failed to download sample template")
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
            form="tax-rates-import-form"
            disabled={importTaxRates.isPending}
          >
            {importTaxRates.isPending && <Spinner className="mr-2" />}
            Import
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
