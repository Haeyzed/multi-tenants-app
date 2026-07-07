"use client"

import { UploadIcon } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useMediaLibraryDnd } from "@/components/tenant/admin/components/media/media-library-dnd"

const INTERACTIVE_SELECTOR =
  "[data-media-item], [data-media-folder], [data-media-empty], [data-media-drop-target], [data-slot=context-menu-item], [data-slot=context-menu-content], [data-slot=context-menu-trigger], [data-slot=context-menu-sub-trigger], [data-slot=sortable-item-handle], button, a, input, textarea, select, [role=checkbox]"

interface MediaUploadContextValue {
  openFilePicker: () => void
  uploadPending: boolean
}

const MediaUploadContext = React.createContext<MediaUploadContextValue | null>(
  null
)

function useMediaUploadContext() {
  const context = React.useContext(MediaUploadContext)

  if (!context) {
    throw new Error(
      "Media upload components must be used within MediaUploadZone."
    )
  }

  return context
}

interface MediaUploadTriggerProps extends Omit<
  React.ComponentProps<typeof Button>,
  "onClick"
> {
  pending?: boolean
}

export function MediaUploadTrigger({
  pending,
  disabled,
  className,
  children,
  ...props
}: MediaUploadTriggerProps) {
  const { openFilePicker, uploadPending } = useMediaUploadContext()
  const isPending = pending ?? uploadPending

  return (
    <Button
      type="button"
      size="sm"
      disabled={disabled || isPending}
      className={className}
      onClick={openFilePicker}
      {...props}
    >
      {children}
    </Button>
  )
}

function MediaUploadDragOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-lg border-2 border-dashed border-primary bg-background/85 backdrop-blur-[1px]">
      <div className="flex flex-col items-center gap-2 px-4 text-center">
        <UploadIcon className="size-8 text-primary" />
        <p className="text-sm font-medium">Drop files to upload</p>
        <p className="text-xs text-muted-foreground">
          Files will be added to the current folder
        </p>
      </div>
    </div>
  )
}

interface MediaUploadZoneProps {
  accept?: string
  disabled?: boolean
  uploadPending?: boolean
  header?: React.ReactNode
  onFilesSelected: (files: File[]) => void
  children: React.ReactNode
  className?: string
}

export function MediaUploadZone({
  accept,
  disabled = false,
  uploadPending = false,
  header,
  onFilesSelected,
  children,
  className,
}: MediaUploadZoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const dragDepthRef = React.useRef(0)
  const [dragOver, setDragOver] = React.useState(false)
  const libraryDnd = useMediaLibraryDnd()
  const isLibraryDragging = libraryDnd?.isDragging ?? false

  const openFilePicker = React.useCallback(() => {
    if (disabled || uploadPending) {
      return
    }

    inputRef.current?.click()
  }, [disabled, uploadPending])

  const processFiles = React.useCallback(
    (files: File[]) => {
      if (disabled || uploadPending || files.length === 0) {
        return
      }

      onFilesSelected(files)
    },
    [disabled, onFilesSelected, uploadPending]
  )

  const handleInputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files ? Array.from(event.target.files) : []
      processFiles(files)
      event.target.value = ""
    },
    [processFiles]
  )

  const handleDragEnter = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      if (disabled || isLibraryDragging) {
        return
      }

      event.preventDefault()
      dragDepthRef.current += 1
      setDragOver(true)
    },
    [disabled, isLibraryDragging]
  )

  const handleDragLeave = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      if (disabled || isLibraryDragging) {
        return
      }

      event.preventDefault()
      dragDepthRef.current = Math.max(0, dragDepthRef.current - 1)

      if (dragDepthRef.current === 0) {
        setDragOver(false)
      }
    },
    [disabled, isLibraryDragging]
  )

  const handleDragOver = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      if (disabled || isLibraryDragging) {
        return
      }

      event.preventDefault()
    },
    [disabled, isLibraryDragging]
  )

  const handleDrop = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      if (disabled || isLibraryDragging) {
        return
      }

      event.preventDefault()
      dragDepthRef.current = 0
      setDragOver(false)
      processFiles(Array.from(event.dataTransfer.files))
    },
    [disabled, isLibraryDragging, processFiles]
  )

  const handleDropzoneClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement

      if (target.closest(INTERACTIVE_SELECTOR)) {
        return
      }

      openFilePicker()
    },
    [openFilePicker]
  )

  const contextValue = React.useMemo<MediaUploadContextValue>(
    () => ({
      openFilePicker,
      uploadPending,
    }),
    [openFilePicker, uploadPending]
  )

  return (
    <MediaUploadContext.Provider value={contextValue}>
      <div className={cn("flex flex-col gap-4", className)}>
        {header}

        <div
          role="region"
          aria-label="Media upload dropzone"
          aria-disabled={disabled}
          tabIndex={disabled ? undefined : 0}
          className={cn(
            "relative min-h-[12rem] rounded-lg border-2 border-dashed border-transparent p-1 transition-colors outline-none",
            dragOver && "border-primary/40 bg-accent/15",
            disabled && "cursor-default"
          )}
          onClick={handleDropzoneClick}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onKeyDown={(event) => {
            if (disabled) {
              return
            }

            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault()
              openFilePicker()
            }
          }}
        >
          {children}
          {dragOver && !disabled ? <MediaUploadDragOverlay /> : null}
        </div>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          className="sr-only"
          disabled={disabled || uploadPending}
          onChange={handleInputChange}
        />
      </div>
    </MediaUploadContext.Provider>
  )
}
