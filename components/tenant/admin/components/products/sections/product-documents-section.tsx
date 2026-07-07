"use client"

import * as React from "react"
import { Download, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
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
import {
  useCreateProductDocument,
  useDeleteProductDocument,
  useGetProductDocuments,
} from "@/hooks/tenant/use-product-nested-query"
import { DOCUMENT_MEDIA_ACCEPT } from "@/lib/tenant/media-file-kind"
import { downloadMediaItem } from "@/lib/tenant/media-download"
import { resolveTenantMediaUrl } from "@/lib/tenant-media-url"
import { type Product } from "@/types/tenant/product"
import { type ProductDocument } from "@/types/tenant/product-nested"
import { type MediaItem } from "@/types/tenant/media"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"

const documentTypeOptions = [
  { label: "Manual", value: "manual" },
  { label: "Datasheet", value: "datasheet" },
  { label: "Certificate", value: "certificate" },
  { label: "Warranty", value: "warranty" },
]

type ProductDocumentsSectionProps = {
  product: Product
}

function resolveDocumentMedia(
  productDocument: ProductDocument
): MediaItem | null {
  const source = productDocument.media
  const url = source?.url
    ? resolveTenantMediaUrl(source)
    : productDocument.media_url
      ? resolveTenantMediaUrl({ url: productDocument.media_url, path: null })
      : null

  if (!url) {
    return null
  }

  return {
    id: source?.id ?? productDocument.media_id ?? 0,
    folder_id: null,
    name: source?.name ?? productDocument.title,
    title: productDocument.title,
    alt_text: null,
    file_name: source?.file_name ?? productDocument.title,
    mime_type: source?.mime_type ?? null,
    disk: "",
    size: 0,
    url,
    uploaded_by: null,
    created_at: null,
    updated_at: null,
  }
}

export function ProductDocumentsSection({
  product,
}: ProductDocumentsSectionProps) {
  const { data: documents = [] as ProductDocument[], isLoading } =
    useGetProductDocuments(product.id)
  const createDocument = useCreateProductDocument(product.id)
  const deleteDocument = useDeleteProductDocument(product.id)

  const [mediaId, setMediaId] = React.useState<number | null>(null)
  const [title, setTitle] = React.useState("")
  const [documentType, setDocumentType] = React.useState("manual")
  const [isPublic, setIsPublic] = React.useState(true)

  const selectedType =
    documentTypeOptions.find((item) => item.value === documentType) ??
    documentTypeOptions[0]

  const handleMediaChange = (id: number | null, media?: MediaItem | null) => {
    setMediaId(id)

    if (media && !title.trim()) {
      setTitle(media.title ?? media.name ?? "")
    }
  }

  const handleDownload = async (productDocument: ProductDocument) => {
    const media = resolveDocumentMedia(productDocument)

    if (!media?.url) {
      toast.error("Download URL is not available for this document")
      return
    }

    try {
      await downloadMediaItem(media)
    } catch {
      toast.error("Failed to download document")
    }
  }

  const handleAdd = () => {
    if (!mediaId || !title.trim()) {
      toast.error("Select a file and enter a title")
      return
    }

    createDocument.mutate(
      {
        media_id: mediaId,
        title: title.trim(),
        document_type: documentType as "manual",
        language: "en",
        is_public: isPublic,
      },
      {
        onSuccess: (response) => {
          toastApiSuccess(response.message, "Document added")
          setMediaId(null)
          setTitle("")
        },
        onError: (error) => toastApiError(error, "Failed to add document"),
      }
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Attach manuals, datasheets, certificates, or warranty files (PDF,
          Word, Excel, PowerPoint, and more). Separate from digital download
          files.
        </p>

        <div className="space-y-3 rounded-lg border p-4">
          <MediaPickerField
            label="File"
            value={mediaId}
            onChange={handleMediaChange}
            accept={DOCUMENT_MEDIA_ACCEPT}
          />
          <Field>
            <FieldLabel>Title</FieldLabel>
            <FieldContent>
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Product manual"
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Document type</FieldLabel>
            <FieldContent>
              <Combobox
                items={documentTypeOptions}
                itemToStringValue={(item) => item.label}
                value={selectedType}
                onValueChange={(item) => {
                  if (item) setDocumentType(item.value)
                }}
              >
                <ComboboxInput placeholder="Select type..." />
                <ComboboxContent>
                  <ComboboxEmpty>No types found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item.value} value={item}>
                        {item.label}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </FieldContent>
          </Field>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="document-is-public"
              checked={isPublic}
              onCheckedChange={(checked) => setIsPublic(!!checked)}
            />
            <label htmlFor="document-is-public" className="text-sm font-medium">
              Public on storefront
            </label>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={handleAdd}
            disabled={createDocument.isPending}
          >
            {createDocument.isPending && <Spinner />}
            <Plus className="mr-1 size-3.5" />
            Add document
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        ) : documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">No documents yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Public</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((productDocument) => (
                <TableRow key={productDocument.id}>
                  <TableCell>{productDocument.title}</TableCell>
                  <TableCell className="capitalize">
                    {productDocument.document_type}
                  </TableCell>
                  <TableCell>
                    {productDocument.is_public ? "Yes" : "No"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => handleDownload(productDocument)}
                        aria-label={`Download ${productDocument.title}`}
                      >
                        <Download className="size-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        className="text-destructive"
                        onClick={() =>
                          deleteDocument.mutate(productDocument.id, {
                            onSuccess: (response) =>
                              toastApiSuccess(
                                response.message,
                                "Document removed"
                              ),
                            onError: (error) =>
                              toastApiError(error, "Failed to remove document"),
                          })
                        }
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
