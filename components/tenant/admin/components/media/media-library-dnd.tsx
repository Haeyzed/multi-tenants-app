"use client"

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MeasuringStrategy,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import * as React from "react"

import {
  SortableItem,
  SortableItemHandle,
} from "@/components/ui/sortable"
import { cn } from "@/lib/utils"

export type MediaLibraryDragKind = "media" | "folder"

export interface MediaLibraryDragPayload {
  kind: MediaLibraryDragKind
  id: number
  label: string
}

export function mediaDragId(kind: MediaLibraryDragKind, id: number) {
  return `${kind}-${id}`
}

export function folderDropId(folderId: number | null) {
  return folderId === null ? "drop-root" : `drop-folder-${folderId}`
}

export function parseMediaDragId(
  id: UniqueIdentifier
): MediaLibraryDragPayload | null {
  const value = String(id)
  const match = value.match(/^(media|folder)-(\d+)$/)

  if (!match) {
    return null
  }

  return {
    kind: match[1] as MediaLibraryDragKind,
    id: Number(match[2]),
    label: "",
  }
}

export function parseFolderDropId(id: UniqueIdentifier): number | null {
  const value = String(id)

  if (value === "drop-root") {
    return null
  }

  const match = value.match(/^drop-folder-(\d+)$/)

  return match ? Number(match[1]) : null
}

interface MediaLibraryDndContextValue {
  activePayload: MediaLibraryDragPayload | null
  isDragging: boolean
  enabled: boolean
}

const MediaLibraryDndContext =
  React.createContext<MediaLibraryDndContextValue | null>(null)

export function useMediaLibraryDnd() {
  return React.useContext(MediaLibraryDndContext)
}

interface MediaLibraryDndProviderProps {
  enabled?: boolean
  draggableIds: string[]
  strategy?: "grid" | "list"
  children: React.ReactNode
  renderOverlay?: (payload: MediaLibraryDragPayload) => React.ReactNode
  onDrop: (event: {
    payload: MediaLibraryDragPayload
    targetFolderId: number | null
    copy: boolean
  }) => void
}

export function MediaLibraryDndProvider({
  enabled = true,
  draggableIds,
  strategy = "grid",
  children,
  renderOverlay,
  onDrop,
}: MediaLibraryDndProviderProps) {
  const [activePayload, setActivePayload] =
    React.useState<MediaLibraryDragPayload | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = React.useCallback((event: DragStartEvent) => {
    setIsDragging(true)
    const payload = parseMediaDragId(event.active.id)

    if (payload) {
      setActivePayload(payload)
    }
  }, [])

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const payload = parseMediaDragId(event.active.id)
      setActivePayload(null)
      setIsDragging(false)

      if (!payload || !event.over) {
        return
      }

      const targetFolderId = parseFolderDropId(event.over.id)

      if (targetFolderId === undefined) {
        return
      }

      const copy =
        event.activatorEvent instanceof MouseEvent &&
        (event.activatorEvent.altKey || event.activatorEvent.ctrlKey)

      onDrop({ payload, targetFolderId, copy })
    },
    [onDrop]
  )

  const contextValue = React.useMemo(
    () => ({
      activePayload,
      isDragging,
      enabled,
    }),
    [activePayload, isDragging, enabled]
  )

  if (!enabled) {
    return <>{children}</>
  }

  return (
    <MediaLibraryDndContext.Provider value={contextValue}>
      <DndContext
        sensors={sensors}
        measuring={{
          droppable: {
            strategy: MeasuringStrategy.Always,
          },
        }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => {
          setActivePayload(null)
          setIsDragging(false)
        }}
      >
        <SortableContext
          items={draggableIds}
          strategy={
            strategy === "list"
              ? verticalListSortingStrategy
              : rectSortingStrategy
          }
        >
          {children}
        </SortableContext>

        <DragOverlay className="z-50 cursor-grabbing">
          {activePayload && renderOverlay ? (
            <div className="rounded-md border bg-card px-3 py-2 text-sm shadow-lg">
              {renderOverlay(activePayload)}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </MediaLibraryDndContext.Provider>
  )
}

interface MediaLibraryDraggableProps {
  kind: MediaLibraryDragKind
  id: number
  disabled?: boolean
  className?: string
  children: React.ReactNode
}

export function MediaLibraryDraggable({
  kind,
  id,
  disabled = false,
  className,
  children,
}: MediaLibraryDraggableProps) {
  const dnd = useMediaLibraryDnd()

  if (!dnd?.enabled || disabled) {
    return <div className={className}>{children}</div>
  }

  return (
    <SortableItem
      value={mediaDragId(kind, id)}
      disabled={disabled}
      className={className}
    >
      {children}
    </SortableItem>
  )
}

export function MediaLibraryDragHandle({
  className,
  children,
  onClick,
}: {
  className?: string
  children: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
}) {
  const dnd = useMediaLibraryDnd()

  if (!dnd?.enabled) {
    return null
  }

  return (
    <SortableItemHandle
      className={cn(
        "text-muted-foreground hover:text-foreground opacity-0 transition-opacity group-hover:opacity-100",
        className
      )}
      onClick={(event) => {
        event.stopPropagation()
        onClick?.(event)
      }}
    >
      {children}
    </SortableItemHandle>
  )
}

interface MediaLibraryFolderDropTargetProps {
  folderId: number | null
  disabled?: boolean
  className?: string
  children: React.ReactNode
}

export function MediaLibraryFolderDropTarget({
  folderId,
  disabled = false,
  className,
  children,
}: MediaLibraryFolderDropTargetProps) {
  const dnd = useMediaLibraryDnd()
  const { isOver, setNodeRef } = useDroppable({
    id: folderDropId(folderId),
    disabled: !dnd?.enabled || disabled,
  })

  return (
    <div
      ref={setNodeRef}
      data-media-drop-target
      data-drop-folder-id={folderId ?? "root"}
      className={cn(
        className,
        isOver &&
          dnd?.enabled &&
          "ring-2 ring-primary/50 bg-primary/10 transition-colors"
      )}
    >
      {children}
    </div>
  )
}
