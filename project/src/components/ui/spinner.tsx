import * as React from "react"

import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const spinnerVariants = cva(
  "rounded-full animate-spin",
  {
    variants: {
      variant: {
        light: "border-white/40 border-t-white border-r-white",
        dark: "border-black/20 border-t-black/70 border-r-black/70"
      },
      size: {
        default: 'border-4 w-5 h-5',
        xs: 'border-2 w-3 h-3'
      }
    },
    defaultVariants: {
      variant: "light"
    },
  }
)

function Spinner({
  variant,
  size,
  className
}: React.ComponentProps<"div"> & VariantProps<typeof spinnerVariants>) {
  return (
    <div
      className={cn(spinnerVariants({ variant, size }), className)}
    />
  )
}

export {Spinner, spinnerVariants};