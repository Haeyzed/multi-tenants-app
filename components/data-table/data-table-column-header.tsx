"use client";

import type { Column } from "@tanstack/react-table";
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  EyeOff,
  PinOff,
  X,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.ComponentProps<typeof DropdownMenuTrigger> {
  column: Column<TData, TValue>;
  label: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  label,
  className,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  const canSort = column.getCanSort();
  const canHide = column.getCanHide();
  const canPin = column.getCanPin();

  if (!canSort && !canHide && !canPin) {
    return <div className={cn(className)}>{label}</div>;
  }

  const isPinned = column.getIsPinned();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "-ml-1.5 flex h-8 items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-accent focus:outline-none focus:ring-1 focus:ring-ring data-[state=open]:bg-accent [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
          className,
        )}
        {...props}
      >
        {label}
        {canSort &&
          (column.getIsSorted() === "desc" ? (
            <ChevronDown />
          ) : column.getIsSorted() === "asc" ? (
            <ChevronUp />
          ) : (
            <ChevronsUpDown />
          ))}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
        {canSort && (
          <>
            <DropdownMenuCheckboxItem
              className="relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto [&_svg]:text-muted-foreground"
              checked={column.getIsSorted() === "asc"}
              onClick={() => column.toggleSorting(false)}
            >
              <ChevronUp />
              Asc
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              className="relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto [&_svg]:text-muted-foreground"
              checked={column.getIsSorted() === "desc"}
              onClick={() => column.toggleSorting(true)}
            >
              <ChevronDown />
              Desc
            </DropdownMenuCheckboxItem>
            {column.getIsSorted() && (
              <DropdownMenuItem
                className="pl-2 [&_svg]:text-muted-foreground"
                onClick={() => column.clearSorting()}
              >
                <X />
                Reset
              </DropdownMenuItem>
            )}
          </>
        )}
        {canHide && (
          <DropdownMenuCheckboxItem
            className="relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto [&_svg]:text-muted-foreground"
            checked={!column.getIsVisible()}
            onClick={() => column.toggleVisibility(false)}
          >
            <EyeOff />
            Hide
          </DropdownMenuCheckboxItem>
        )}
        {canPin && (canSort || canHide) && <DropdownMenuSeparator />}
        {canPin && (
          <>
            {isPinned !== "left" && (
              <DropdownMenuItem
                className="pl-2 [&_svg]:text-muted-foreground"
                onClick={() => column.pin("left")}
              >
                <ArrowLeftToLine />
                Pin to left
              </DropdownMenuItem>
            )}
            {isPinned !== "right" && (
              <DropdownMenuItem
                className="pl-2 [&_svg]:text-muted-foreground"
                onClick={() => column.pin("right")}
              >
                <ArrowRightToLine />
                Pin to right
              </DropdownMenuItem>
            )}
            {isPinned && (
              <DropdownMenuItem
                className="pl-2 [&_svg]:text-muted-foreground"
                onClick={() => column.pin(false)}
              >
                <PinOff />
                Unpin
              </DropdownMenuItem>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
