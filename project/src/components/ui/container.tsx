import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const containerVariants = cva(
  "mx-auto w-full",
  {
    variants: {
      size: {
        default: "max-w-4xl"
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

function Container({
  className,
  size,
  children,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof containerVariants>) {
  return (
    <div
      data-slot="container"
      className={cn(containerVariants({ size, className }))}
      {...props}
    >
      {children}
    </div>
  )
}

export { Container, containerVariants }
