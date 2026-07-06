"use client"

import * as React from "react"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MediaPickerField } from "@/components/tenant/admin/components/media/media-picker-field"
import { useSyncProductDownloads } from "@/hooks/tenant/use-product-variant-query"
import {
  syncProductDownloadsSchema,
  type SyncProductDownloadsFormValues,
} from "@/schemas/tenant/product-schema"
import { type Product } from "@/types/tenant/product"
import { FieldError } from "./product-form-shared"

type ProductDownloadsSectionProps = {
  product: Product
}

function createEmptyDownload(): SyncProductDownloadsFormValues["downloads"][number] {
  return {
    media_id: 0,
    display_name: "",
    description: "",
    download_limit: null,
    download_expiry_days: null,
    is_preview: false,
  }
}

function mapProductDownloads(product: Product): SyncProductDownloadsFormValues["downloads"] {
  return (
    product.downloads?.map((download) => ({
      media_id: download.media_id,
      file_name: download.file_name,
      display_name: download.display_name ?? "",
      description: download.description ?? "",
      download_limit: download.download_limit ?? null,
      download_expiry_days: download.download_expiry_days ?? null,
      sort_order: download.sort_order,
      is_preview: download.is_preview ?? false,
    })) ?? []
  )
}

export function ProductDownloadsSection({ product }: ProductDownloadsSectionProps) {
  const syncDownloads = useSyncProductDownloads(product.id)
  const [downloads, setDownloads] = React.useState(() => mapProductDownloads(product))
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const updateDownload = (
    index: number,
    patch: Partial<SyncProductDownloadsFormValues["downloads"][number]>
  ) => {
    setDownloads((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      )
    )
  }

  const handleSave = () => {
    const payload = { downloads }
    const result = syncProductDownloadsSchema.safeParse(payload)

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path.join(".")] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    syncDownloads.mutate(result.data, {
      onSuccess: () => toast.success("Downloads saved"),
      onError: () => toast.error("Failed to save downloads"),
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Digital downloads</CardTitle>
          <p className="text-sm text-muted-foreground">
            Attach files customers receive after purchase.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setDownloads((current) => [...current, createEmptyDownload()])}
        >
          <Plus className="mr-1 size-4" />
          Add file
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {downloads.length === 0 ? (
          <p className="text-sm text-muted-foreground">No download files yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File</TableHead>
                <TableHead>Display name</TableHead>
                <TableHead>Limit</TableHead>
                <TableHead>Expiry (days)</TableHead>
                <TableHead>Preview</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {downloads.map((download, index) => (
                <TableRow key={`download-${index}`}>
                  <TableCell className="min-w-[220px]">
                    <MediaPickerField
                      label=""
                      value={download.media_id || null}
                      previewUrl={product.downloads?.[index]?.media?.url}
                      previewTitle={
                        product.downloads?.[index]?.media?.name ??
                        download.display_name ??
                        "Download"
                      }
                      accept="*/*"
                      onChange={(mediaId, media) =>
                        updateDownload(index, {
                          media_id: mediaId ?? 0,
                          file_name: media?.file_name ?? media?.name ?? undefined,
                        })
                      }
                    />
                    <FieldError message={errors[`downloads.${index}.media_id`]} />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={download.display_name ?? ""}
                      onChange={(event) =>
                        updateDownload(index, { display_name: event.target.value })
                      }
                      placeholder="Customer-facing name"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={1}
                      value={download.download_limit ?? ""}
                      onChange={(event) =>
                        updateDownload(index, {
                          download_limit: event.target.value
                            ? Number(event.target.value)
                            : null,
                        })
                      }
                      placeholder="Unlimited"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={1}
                      value={download.download_expiry_days ?? ""}
                      onChange={(event) =>
                        updateDownload(index, {
                          download_expiry_days: event.target.value
                            ? Number(event.target.value)
                            : null,
                        })
                      }
                      placeholder="Never"
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={download.is_preview ?? false}
                      onCheckedChange={(checked) =>
                        updateDownload(index, { is_preview: !!checked })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setDownloads((current) =>
                          current.filter((_, itemIndex) => itemIndex !== index)
                        )
                      }
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <div className="flex justify-end">
          <Button type="button" onClick={handleSave} disabled={syncDownloads.isPending}>
            {syncDownloads.isPending && <Spinner />}
            Save downloads
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
