"use client"

import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { type StoreProductFormValues } from "@/schemas/tenant/product-schema"
import { type ProductFormSectionProps } from "./product-form-shared"

type VideoItem = NonNullable<StoreProductFormValues["videos"]>[number]

function createEmptyVideo(): VideoItem {
  return {
    video_url: "",
    title: "",
    description: "",
    is_primary: false,
  }
}

export function ProductVideosSection({ form }: ProductFormSectionProps) {
  const videos = form.watch("videos") ?? []

  const updateVideos = (next: VideoItem[]) => {
    form.setValue("videos", next, { shouldDirty: true })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle>Videos</CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => updateVideos([...videos, createEmptyVideo()])}
        >
          <Plus className="mr-1 size-3.5" />
          Add video
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {videos.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Add YouTube videos for this product.
          </p>
        ) : (
          videos.map((video, index) => (
            <div
              key={`video-${index}`}
              className="space-y-3 rounded-lg border p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">Video #{index + 1}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="text-destructive"
                  onClick={() =>
                    updateVideos(videos.filter((_, i) => i !== index))
                  }
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
              <Field>
                <FieldLabel>YouTube URL</FieldLabel>
                <FieldContent>
                  <Input
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={video.video_url}
                    onChange={(event) => {
                      const next = [...videos]
                      next[index] = { ...video, video_url: event.target.value }
                      updateVideos(next)
                    }}
                  />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Title</FieldLabel>
                <FieldContent>
                  <Input
                    value={video.title ?? ""}
                    onChange={(event) => {
                      const next = [...videos]
                      next[index] = { ...video, title: event.target.value }
                      updateVideos(next)
                    }}
                  />
                </FieldContent>
              </Field>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`video-primary-${index}`}
                  checked={!!video.is_primary}
                  onCheckedChange={(checked) => {
                    const next = videos.map((item, i) => ({
                      ...item,
                      is_primary: i === index ? !!checked : false,
                    }))
                    updateVideos(next)
                  }}
                />
                <label
                  htmlFor={`video-primary-${index}`}
                  className="text-sm font-medium"
                >
                  Primary video
                </label>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
