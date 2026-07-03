"use client"

import { cn } from "@/lib/utils"
import type { MediaFolderTreeNode } from "@/types/tenant/media"
import {
  ChevronDownIcon,
  ChevronRightIcon,
  CopyIcon,
  FolderIcon,
  FolderInputIcon,
  FolderOpenIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"
import * as React from "react"

import { MediaLibraryFolderDropTarget } from "@/components/tenant/admin/components/media/media-library-dnd"
import { Button } from "@/components/ui/button"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

function runMenuAction(action: () => void) {
  return (event: { preventDefault: () => void; stopPropagation: () => void }) => {
    event.preventDefault()
    event.stopPropagation()
    action()
  }
}

interface MediaFolderTreeProps {
  tree: MediaFolderTreeNode[]
  selectedFolderId: number | null
  onSelectFolder: (folderId: number | null) => void
  enableDropTargets?: boolean
  onRenameFolder?: (node: MediaFolderTreeNode) => void
  onDeleteFolder?: (node: MediaFolderTreeNode) => void
  onMoveFolder?: (node: MediaFolderTreeNode) => void
  onCopyFolder?: (node: MediaFolderTreeNode) => void
  className?: string
}

export function MediaFolderTree({
  tree,
  selectedFolderId,
  onSelectFolder,
  enableDropTargets = false,
  onRenameFolder,
  onDeleteFolder,
  onMoveFolder,
  onCopyFolder,
  className,
}: MediaFolderTreeProps) {
  const rootButton = (
    <Button
      type="button"
      variant={selectedFolderId === null ? "secondary" : "ghost"}
      className="w-full justify-start gap-2"
      onClick={() => onSelectFolder(null)}
    >
      <FolderOpenIcon className="size-4 shrink-0" />
      <span className="min-w-0 flex-1 truncate text-start">All files</span>
    </Button>
  )

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {enableDropTargets ? (
        <MediaLibraryFolderDropTarget folderId={null}>
          {rootButton}
        </MediaLibraryFolderDropTarget>
      ) : (
        rootButton
      )}
      {tree.map((node) => (
        <FolderTreeNode
          key={node.id}
          node={node}
          depth={0}
          selectedFolderId={selectedFolderId}
          onSelectFolder={onSelectFolder}
          enableDropTargets={enableDropTargets}
          onRenameFolder={onRenameFolder}
          onDeleteFolder={onDeleteFolder}
          onMoveFolder={onMoveFolder}
          onCopyFolder={onCopyFolder}
        />
      ))}
    </div>
  )
}

function FolderTreeNode({
  node,
  depth,
  selectedFolderId,
  onSelectFolder,
  enableDropTargets,
  onRenameFolder,
  onDeleteFolder,
  onMoveFolder,
  onCopyFolder,
}: {
  node: MediaFolderTreeNode
  depth: number
  selectedFolderId: number | null
  onSelectFolder: (folderId: number | null) => void
  enableDropTargets: boolean
  onRenameFolder?: (node: MediaFolderTreeNode) => void
  onDeleteFolder?: (node: MediaFolderTreeNode) => void
  onMoveFolder?: (node: MediaFolderTreeNode) => void
  onCopyFolder?: (node: MediaFolderTreeNode) => void
}) {
  const [expanded, setExpanded] = React.useState(depth < 1)
  const hasChildren = node.children.length > 0
  const isSelected = selectedFolderId === node.id
  const hasContextMenu =
    onRenameFolder || onDeleteFolder || onMoveFolder || onCopyFolder

  const folderButton = (
    <Button
      type="button"
      variant={isSelected ? "secondary" : "ghost"}
      data-media-folder
      className="h-8 min-w-0 flex-1 justify-start gap-2 px-2"
      onClick={() => onSelectFolder(node.id)}
    >
      <FolderIcon className="size-4 shrink-0" />
      <span className="min-w-0 truncate text-start">{node.name}</span>
    </Button>
  )

  const folderLabel = hasContextMenu ? (
    <ContextMenu>
      <ContextMenuTrigger render={folderButton} />
      <ContextMenuContent>
        {onMoveFolder ? (
          <ContextMenuItem onClick={runMenuAction(() => onMoveFolder(node))}>
            <FolderInputIcon />
            Move
          </ContextMenuItem>
        ) : null}
        {onCopyFolder ? (
          <ContextMenuItem onClick={runMenuAction(() => onCopyFolder(node))}>
            <CopyIcon />
            Copy
          </ContextMenuItem>
        ) : null}
        {onRenameFolder ? (
          <ContextMenuItem onClick={runMenuAction(() => onRenameFolder(node))}>
            <PencilIcon />
            Rename
          </ContextMenuItem>
        ) : null}
        {onDeleteFolder ? (
          <>
            {onRenameFolder || onMoveFolder || onCopyFolder ? (
              <ContextMenuSeparator />
            ) : null}
            <ContextMenuItem
              variant="destructive"
              onClick={runMenuAction(() => onDeleteFolder(node))}
            >
              <Trash2Icon />
              Delete
            </ContextMenuItem>
          </>
        ) : null}
      </ContextMenuContent>
    </ContextMenu>
  ) : (
    folderButton
  )

  const folderRow = (
    <div className="flex w-full items-center gap-1">
      <div
        className="flex min-w-0 flex-1 items-center gap-1"
        style={{ paddingLeft: `${depth * 12}px` }}
      >
        {hasChildren ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="size-7 shrink-0"
            onClick={() => setExpanded((current) => !current)}
          >
            {expanded ? (
              <ChevronDownIcon className="size-4" />
            ) : (
              <ChevronRightIcon className="size-4" />
            )}
          </Button>
        ) : (
          <span className="size-7 shrink-0" />
        )}
        {folderLabel}
      </div>
      <span className="w-6 shrink-0 pe-0.5 text-end text-xs tabular-nums text-muted-foreground">
        {node.media_count}
      </span>
    </div>
  )

  const folderRowWithDrop = enableDropTargets ? (
    <MediaLibraryFolderDropTarget folderId={node.id} className="w-full">
      {folderRow}
    </MediaLibraryFolderDropTarget>
  ) : (
    folderRow
  )

  return (
    <div>
      {folderRowWithDrop}
      {hasChildren && expanded
        ? node.children.map((child) => (
            <FolderTreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedFolderId={selectedFolderId}
              onSelectFolder={onSelectFolder}
              enableDropTargets={enableDropTargets}
              onRenameFolder={onRenameFolder}
              onDeleteFolder={onDeleteFolder}
              onMoveFolder={onMoveFolder}
              onCopyFolder={onCopyFolder}
            />
          ))
        : null}
    </div>
  )
}
