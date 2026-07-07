"use client"

import * as React from "react"
import {
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Underline,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type RichTextEditorProps = {
  value?: string | null
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

function exec(command: string, value?: string) {
  document.execCommand(command, false, value)
}

export function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Write something...",
  className,
  disabled = false,
}: RichTextEditorProps) {
  const editorRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const element = editorRef.current
    if (!element) return
    if (element.innerHTML !== (value ?? "")) {
      element.innerHTML = value ?? ""
    }
  }, [value])

  const emitChange = () => {
    const html = editorRef.current?.innerHTML ?? ""
    onChange?.(html === "<br>" ? "" : html)
  }

  const handleLink = () => {
    const url = window.prompt("Enter URL")
    if (!url) return
    exec("createLink", url)
    emitChange()
  }

  return (
    <div className={cn("overflow-hidden rounded-md border", className)}>
      <div className="flex flex-wrap gap-1 border-b bg-muted/40 p-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          disabled={disabled}
          onClick={() => {
            exec("bold")
            emitChange()
          }}
        >
          <Bold className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          disabled={disabled}
          onClick={() => {
            exec("italic")
            emitChange()
          }}
        >
          <Italic className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          disabled={disabled}
          onClick={() => {
            exec("underline")
            emitChange()
          }}
        >
          <Underline className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          disabled={disabled}
          onClick={() => {
            exec("insertUnorderedList")
            emitChange()
          }}
        >
          <List className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          disabled={disabled}
          onClick={() => {
            exec("insertOrderedList")
            emitChange()
          }}
        >
          <ListOrdered className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          disabled={disabled}
          onClick={handleLink}
        >
          <LinkIcon className="size-3.5" />
        </Button>
      </div>
      <div
        ref={editorRef}
        contentEditable={!disabled}
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={emitChange}
        onBlur={emitChange}
        className={cn(
          "min-h-32 px-3 py-2 text-sm outline-none",
          "empty:before:pointer-events-none empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]",
          disabled && "cursor-not-allowed opacity-60"
        )}
      />
    </div>
  )
}
