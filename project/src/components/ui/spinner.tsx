import * as React from "react"

import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const spinnerVariants = cva(
  "border-4 w-5 h-5 rounded-full animate-spin",
  {
    variants: {
      variant: {
        light: "border-white/40 border-t-white border-r-white",
        dark: "border-black/20 border-t-black/70 border-r-black/70"
      }
    },
    defaultVariants: {
      variant: "light"
    },
  }
)

function Spinner({
  variant,
  className
}: React.ComponentProps<"div"> & VariantProps<typeof spinnerVariants>) {
  return (
    <div
      className={cn(spinnerVariants({ variant }), className)}
    />
  )
}

export {Spinner, spinnerVariants};