import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type ErrorProps = {
  message: ReactNode;
  className?: string;
};

export const Error = ({ message, className }: ErrorProps) => (
  <div className={cn("flex items-start gap-2 text-destructive text-sm", className)}>
    <AlertCircle className="mt-0.5" size={16} />
    <div className="w-full">{message}</div>
  </div>
);
