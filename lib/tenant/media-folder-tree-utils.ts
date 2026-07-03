import type { MediaFolderTreeNode } from "@/types/tenant/media"

export function findFolderTreeNode(
  tree: MediaFolderTreeNode[],
  folderId: number
): MediaFolderTreeNode | null {
  for (const node of tree) {
    if (node.id === folderId) {
      return node
    }

    const child = findFolderTreeNode(node.children, folderId)

    if (child) {
      return child
    }
  }

  return null
}

export function collectFolderDescendantIds(
  node: MediaFolderTreeNode
): number[] {
  return [
    node.id,
    ...node.children.flatMap((child) => collectFolderDescendantIds(child)),
  ]
}

export function isInvalidFolderDropTarget(
  sourceFolderId: number,
  targetFolderId: number | null,
  tree: MediaFolderTreeNode[]
): boolean {
  if (targetFolderId === null) {
    return false
  }

  if (sourceFolderId === targetFolderId) {
    return true
  }

  const sourceNode = findFolderTreeNode(tree, sourceFolderId)

  if (!sourceNode) {
    return false
  }

  return collectFolderDescendantIds(sourceNode).includes(targetFolderId)
}
