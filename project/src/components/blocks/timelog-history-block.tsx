"use client";

import { useEffect } from "react";
import { dateToHourMinuteSeconds, dateToYearMonthDay, timeBetween } from "@/lib/date";
import { useTimeLogsInfiniteQuery } from "@/queries/use-timelog-infinite-query";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Spinner } from "../ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useInView } from "react-intersection-observer";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Edit, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { useDeleteTimelogMutation } from "@/mutations/use-delete-timelog-mutation";
import { showTimeLogEntryModal } from "../modals/time-log-entry-modal";

export default function TimelogHistoryBlock({projectId}: {projectId: string}) {
  
  const { data: timelogPages, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useTimeLogsInfiniteQuery(projectId);
  const { ref, inView } = useInView({ trackVisibility: true, delay: 100 });
  
  const {mutate: deleteTimelog, isPending: isPendingDelete} = useDeleteTimelogMutation();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);
  
  const onDelete = (timelogId: string) => {
    deleteTimelog({projectId, timelogId});
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">History</CardTitle>
        <CardAction>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => showTimeLogEntryModal(projectId)}
          ><Plus /></Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col items-start justify-between h-full">
        {(!timelogPages || timelogPages.pages.length < 1 || timelogPages.pages[0].data.length < 1) ? (
          isLoading ? (
            <Spinner variant="dark" className="m-auto" />
          ) : (
            <p className="text-muted-foreground text-sm">No timelog history found for this project.</p>
          )
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead className="w-[100px]">Time</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right w-[50px]">Duration</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                  { timelogPages?.pages.map(page => (
                    page.data.map(timelog => (
                      <TableRow key={timelog.id}>
                        <TableCell>{dateToYearMonthDay(timelog.start)}</TableCell>
                        <TableCell>{dateToHourMinuteSeconds(timelog.start)}</TableCell>
                        <TableCell>{timelog.categoryName}</TableCell>
                        <TableCell className="text-right">{timeBetween(timelog.start, timelog.end!)}</TableCell>
                        <TableCell className="text-right w-[50px]">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="cursor-pointer"
                                onClick={() => showTimeLogEntryModal(projectId, timelog)}
                                disabled={isPendingDelete}
                              >
                                <Edit />
                                View & Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                variant="destructive"
                                className="cursor-pointer"
                                onClick={e => {
                                  e.preventDefault();
                                  onDelete(timelog.id);
                                }}
                                disabled={isPendingDelete}
                              >
                                {isPendingDelete ? <Spinner variant="dark" /> : <Trash2 />}
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )) }
              </TableBody>
            </Table>
          </>
        ) }
        <div ref={ref}>
          {isFetchingNextPage ? (
            <Spinner variant="dark" />
          ) : (!hasNextPage && timelogPages && timelogPages.pages.length > 0 && timelogPages.pages[0].data.length > 0) ? (
            <p className="pt-2 text-muted-foreground text-sm text-center">No more entries</p>
          ) : undefined}
        </div>
      </CardContent>
    </Card>
  );
}
