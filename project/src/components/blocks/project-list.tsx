"use client";

import { useProjectsQuery } from "@/queries/get-projects-query";
import { Spinner } from "../ui/spinner";
import { dateToYearMonthDay } from "@/lib/date";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { PendingWrapper } from "../ui/pending-wrapper";

export default function ProjectList({
  onProjectSelect
}: {
  onProjectSelect: (id: string) => void
}) {
  const {data, isPending, error} = useProjectsQuery();
  
  return (
    <PendingWrapper isPending={isPending} error={error?.message}>
      <ul>
        {data?.map(project => (
          <li key={project.id} onClick={() => onProjectSelect(project.id)} className="grid grid-cols-4 not-last:mb-4 p-2 rounded border-black/20 border cursor-pointer hover:bg-primary/5 hover:text-primary hover:border-primary">
            <div className="flex flex-col col-span-1">
              <span className="font-medium tracking-tight">{project.title}</span>
              <span className="text-sm opacity-70 tracking-wide">{dateToYearMonthDay(project.createdAt)}</span>
            </div>
            <div className="flex items-center col-span-3 italic opacity-70">
              {project.description}
            </div>
          </li>
        ))}
      </ul>
    </PendingWrapper>
  );
}