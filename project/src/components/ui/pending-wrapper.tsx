import * as React from "react"
import { Spinner } from "./spinner";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { AlertCircle } from "lucide-react";

function PendingWrapper({
  children,
  error,
  isPending,
  action
}: {
  children: React.ReactNode,
  error?: string,
  isPending?: boolean,
  action?: React.ReactNode
}) {
  return (
    <div className="relative">
      {error ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          {action ? (
            <AlertDescription>{action}</AlertDescription>
          ) : undefined}
        </Alert>
      ) : children}
      { isPending ? (
        <div className="absolute -inset-4 bg-white/70 backdrop-blur-xs flex justify-center items-center p-6">
          <Spinner variant="dark" />
        </div>
      ) : undefined }
    </div>
  )
}

export {PendingWrapper};