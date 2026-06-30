import { cn } from "@/lib/utils"

type MainProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean
  fluid?: boolean
}

export function Main({ fixed, className, fluid, ...props }: MainProps) {
  return (
    <main
      id="content"
      data-layout={fixed ? "fixed" : "auto"}
      className={cn(
        "flex flex-1 flex-col gap-4 px-4 py-6 pt-0 sm:gap-6",
        fixed && "flex grow flex-col overflow-hidden",
        !fluid &&
          "@7xl/content:mx-auto @7xl/content:w-full @7xl/content:max-w-7xl",
        className
      )}
      {...props}
    />
  )
}
