"use client"

import { cn } from "@/lib/utils"
import type { MediaFolderTreeNode } from "@/types/tenant/media"
import {
  ChevronDownIcon,
  ChevronRightIcon,
  FolderIcon,
  FolderOpenIcon,
} from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"

interface MediaFolderTreeProps {
  tree: MediaFolderTreeNode[]
  selectedFolderId: number | null
  onSelectFolder: (folderId: number | null) => void
  className?: string
}

export function MediaFolderTree({
  tree,
  selectedFolderId,
  onSelectFolder,
  className,
}: MediaFolderTreeProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <Button
        type="button"
        variant={selectedFolderId === null ? "secondary" : "ghost"}
        className="justify-start gap-2"
        onClick={() => onSelectFolder(null)}
      >
        <FolderOpenIcon className="size-4 shrink-0" />
        All files
      </Button>
      {tree.map((node) => (
        <FolderTreeNode
          key={node.id}
          node={node}
          depth={0}
          selectedFolderId={selectedFolderId}
          onSelectFolder={onSelectFolder}
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
}: {
  node: MediaFolderTreeNode
  depth: number
  selectedFolderId: number | null
  onSelectFolder: (folderId: number | null) => void
}) {
  const [expanded, setExpanded] = React.useState(depth < 1)
  const hasChildren = node.children.length > 0
  const isSelected = selectedFolderId === node.id

  return (
    <div>
      <div
        className="flex items-center gap-1"
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
        <Button
          type="button"
          variant={isSelected ? "secondary" : "ghost"}
          className="min-w-0 flex-1 justify-start gap-2 truncate"
          onClick={() => onSelectFolder(node.id)}
        >
          <FolderIcon className="size-4 shrink-0" />
          <span className="truncate">{node.name}</span>
          <span className="ms-auto text-xs text-muted-foreground">
            {node.media_count}
          </span>
        </Button>
      </div>
      {hasChildren && expanded
        ? node.children.map((child) => (
            <FolderTreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedFolderId={selectedFolderId}
              onSelectFolder={onSelectFolder}
            />
          ))
        : null}
    </div>
  )
}
