"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { useCategoriesQuery } from "@/queries/use-categories-query";
import { useEffect, useRef, useState } from "react";
import { Error } from "../ui/error";
import { PendingWrapper } from "../ui/pending-wrapper";
import { useCreateTimelogMutation } from "@/mutations/use-create-timelog-mutation";
import { useActiveTimelogQuery } from "@/queries/use-active-timelog-query";
import { Skeleton } from "../ui/skeleton";
import { useUpdateTimelogMutation } from "@/mutations/use-update-timelog-mutation";
import { timeBetween } from "@/lib/date";
import { Spinner } from "../ui/spinner";

type TimelogControlBlockProps = {
  projectId: string
};


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


export function TimelogControlBlock({projectId}: TimelogControlBlockProps) {

  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const { data: categories, isPending: isPendingCategories, error: errorCategories } = useCategoriesQuery(projectId)
  const { data: activeTimelog, isPending: isPendingActiveTimelog } = useActiveTimelogQuery(projectId);

  const {mutate: start, isPending: isPendingStart} = useCreateTimelogMutation();
  const {mutate: update, isPending: isPendingUpdate, isError: isErrorUpdate} = useUpdateTimelogMutation();

  const isRunning = !!activeTimelog;
  const isPending = isPendingCategories || isPendingActiveTimelog;
  const error = errorCategories;

  useEffect(() => {
    if(activeTimelog) {
      setCategory(activeTimelog.categoryId);
      setDescription(activeTimelog.description || '');
    }
  }, [activeTimelog]);

  // Update timelog description and category if they change.
  useEffect(() => {
    if(!activeTimelog || (category == activeTimelog.categoryId && description == activeTimelog.description)) {
      setIsAutoSaving(false);
      return;
    }

    setIsAutoSaving(true);
    const timeoutId = setTimeout(() => {
      update({ 
        timelogId: activeTimelog.id,
        projectId,
        categoryId: category, 
        description
      }, {
        onSuccess: () => {
          setIsAutoSaving(false);
        }
      })
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [activeTimelog, category, description]);

  const onStart = () => {
    start({projectId, categoryId: category, description});
  }

  const onStop = () => {
    if(!activeTimelog)
      return;
    update({projectId, timelogId: activeTimelog.id, categoryId: category, description, end: new Date().toISOString()}, {
      onSuccess: () => {
        setCategory('');
        setDescription('');
      }
    })
  }

  if(error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Start New Timelog
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Error message={error.message} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      isRunning
        ? "border-amber-500 bg-amber-50/50 border-2 shadow-rose-100 shadow-md"
        : "border-muted border"
    )}>
      <CardHeader>
        <CardTitle className="flex items-center gap-4 text-xl font-bold">
          { isPending ? (
            <Skeleton className="w-48 h-7" />
          ) :isRunning ? "Ongoing Timelog" : "Start New Timelog"}
          { isErrorUpdate ? (
            <Error message="Failed to save changes." />
          ) : isAutoSaving ? (
            <div className="text-sm flex items-center gap-2 font-normal italic text-muted-foreground">
              <Spinner variant="dark" size="xs" />
              Saving
            </div>
          ) : undefined }
        </CardTitle>
      </CardHeader>

      <CardContent>
        <PendingWrapper isPending={isPendingCategories} className="space-y-4">
          {/* Category Select */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Category</label>
            <Select 
              value={category} 
              onValueChange={value => setCategory(value)}
              disabled={isPending || isPendingStart}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map(c => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Notes</label>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What are you working on?"
              className="resize-none"
              disabled={isPending || isPendingStart}
            />
          </div>

          {/* Elapsed time and Start/Stop button */}
          <div className="flex justify-between items-center">
            {isRunning && (
              <div className="flex flex-col text-muted-foreground">
                <span className="text-sm font-medium text-muted-foreground">Elapsed</span>
                <span className="font-mono text-primary font-semibold">
                  <ActiveTimeCounter start={activeTimelog.start} />
                </span>
              </div>
            )}
            
            <Button
              onClick={isRunning ? onStop : onStart}
              variant={isRunning ? "destructive" : "default"}
              disabled={isPending || category.length < 1}
              isPending={isPendingStart || isPendingUpdate}
            >
              {isRunning ? (
                <>
                  <Square className="mr-2 h-4 w-4" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Start
                </>
              )}
            </Button>
          </div>
        </PendingWrapper>
      </CardContent>
    </Card>
  );
}
