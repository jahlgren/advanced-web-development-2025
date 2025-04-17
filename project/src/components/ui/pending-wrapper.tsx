
import { ReactNode } from "react"
import { AlertCircle } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { Error } from "./error"

type PendingWrapperProps = {
  isPending: boolean
  error?: ReactNode
  errorTitle?: ReactNode
  children: ReactNode
  className?: string
}

export function PendingWrapper({
  isPending,
  error,
  children,
  className,
}: PendingWrapperProps) {
  if (error) {
    return (
      <Error message={error} />
    );
  }

  return (
    <div className={cn("relative min-w-6 min-h-6", className)}>
      {children}

      {isPending && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center z-10">
          <Spinner className="h-6 w-6 shrink-0" variant="dark" />
        </div>
      )}
    </div>
  );
}
