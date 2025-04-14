import { Project } from "@/lib/types";
import { showTimeLogEntryModal } from "../modals/time-log-entry-modal";
import { Button } from "../ui/button";
import { useTimeLogsQuery } from "@/queries/get-timelog-query";
import { PendingWrapper } from "../ui/pending-wrapper";
import { useEffect, useMemo, useState } from "react";
import { dateToHourMinuteSeconds, dateToYearMonthDay, timeBetween } from "@/lib/date";
import { Pencil } from "lucide-react";

function ActiveTimeCounter({start}: {start: Date}) {
  const [end, setEnd] = useState(new Date());
  useEffect(() => {
    const id = setTimeout(() => {
      setEnd(new Date());
    }, 250);
    return () => clearTimeout(id);
  }, [end.getTime()]);
  return <>{timeBetween(start, end)}</>
}

export default function TimeLogs({project}: {project: Project}) {
  
  const {data, isPending, error} = useTimeLogsQuery(project.id);

  const canAddNewTimelog = !data ? false : !data.find(d => !d.end);

  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    if(project.categories) {
      project.categories.forEach((category) => {
        map.set(category.id, category.name);
      });
    }
    return map;
  }, [project.id, project.categories, project.categories?.length]);

  const getCategoryName = (categoryId: string): string => {
    return categoryMap.get(categoryId) || "Unknown";
  };

  return (
      <div>
        <h3 className="mb-2 font-medium tracking-tight text-lg">Time Logs</h3>
        
        <PendingWrapper isPending={isPending} error={error?.message}>
          <ul>
            {canAddNewTimelog ? (
              <li>
                <Button variant="unstyled"
                  className="mb-6 w-full h-12 border-dashed border-2 border-black/20 text-foreground/60 hover:text-primary hover:border-primary hover:bg-primary/5"
                  onClick={() => showTimeLogEntryModal(project)}
                >New time log...</Button>
              </li>
            ) : undefined}
            {data && data.map(log => (
              <li key={log.id} className={"border rounded text-sm not-last:mb-4 " + (!log.end ? 'border-yellow-600' : 'border-black/20')}>
                <div className={"items-center px-2 py-1 grid grid-cols-4 " + (!log.end ? 'bg-yellow-100' : 'bg-black/5')}>
                  <span className="tracking-tight font-medium">{getCategoryName(log.categoryId)}</span>
                  <span>{dateToYearMonthDay(log.start)}</span>
                  <span className="text-center">{dateToHourMinuteSeconds(log.start)}</span>
                  <div className="flex justify-end items-center">
                    {log.end ? (
                      <span>{timeBetween(log.start, log.end)}</span>
                    ) : <ActiveTimeCounter start={log.start} />}
                    <Button variant="unstyled" className="ml-2 hover:text-primary" size="smallIcon"
                      onClick={() => showTimeLogEntryModal(project, log)}
                    ><Pencil /></Button>
                  </div>
                </div>
                <div className="px-2 py-1">
                  {!log.end ? <span className="font-bold text-yellow-600 italic tracking-tight mr-4">In Progress</span> : undefined}
                  <span>{log.description}</span>
                </div>
              </li>
            ))}
          </ul>
        </PendingWrapper>
      </div>
  );
}
