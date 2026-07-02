declare module "react-file-icon" {
  import type { ComponentType } from "react"

  export type FileIconGlyphType =
    | "3d"
    | "acrobat"
    | "android"
    | "audio"
    | "binary"
    | "code"
    | "compressed"
    | "document"
    | "drive"
    | "font"
    | "image"
    | "presentation"
    | "settings"
    | "spreadsheet"
    | "vector"
    | "video"

  export interface FileIconProps {
    extension?: string
    color?: string
    fold?: boolean
    foldColor?: string
    glyphColor?: string
    gradientColor?: string
    gradientOpacity?: number
    labelColor?: string
    labelTextColor?: string
    labelUppercase?: boolean
    radius?: number
    type?: FileIconGlyphType
  }

  export const FileIcon: ComponentType<FileIconProps>
  export const defaultStyles: Record<string, Partial<FileIconProps>>
}
