"use client";

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { Textarea } from '../ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../ui/select';
import { DateTimePicker } from '../ui/date-time-picker';
import { Timelog } from '@/models/timelog';
import { useCreateTimelogMutation } from '@/mutations/use-create-timelog-mutation';
import { useUpdateTimelogMutation } from '@/mutations/use-update-timelog-mutation';
import { useCategoriesQuery } from '@/queries/use-categories-query';
import { Spinner } from '../ui/spinner';

export const showTimeLogEntryModal = (projectId: string, timelog?: Timelog) => {
  NiceModal.show(TimeLogEntryModal, {projectId, timelog});
}

const TimeLogEntryModal = NiceModal.create(({projectId, timelog}: {projectId: string, timelog?: Timelog}) => {
  
  const [categoryId, setCategoryId] = useState(timelog ? timelog.categoryId : '');
  const [description, setDescription] = useState(timelog ? timelog.description : '');
  const [startTime, setStartTime] = useState<Date|null>(timelog ? new Date(timelog.start) : new Date());
  const [endTime, setEndTime] = useState<Date|null>(timelog && timelog.end ? new Date(timelog.end) : null);

  const {data: categories, isPending: isPendingCategories} = useCategoriesQuery(projectId);
  const {mutate: create, isPending: createIsPending} = useCreateTimelogMutation();
  const {mutate: update, isPending: updateIsPending} = useUpdateTimelogMutation();
  
  const modal = useModal();

  const isPending = createIsPending || updateIsPending;

  useEffect(() => {
    let timeout: NodeJS.Timeout|undefined;
    if(!modal.visible) {
      timeout = setTimeout(() => {
        modal.remove();
      }, 500);
    }
    return () => {
      clearTimeout(timeout);
    }
  }, [modal.visible])

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if(isPending)
      return;

    const data = {
      projectId,
      categoryId,
      description: description ? description : null,
      start: startTime ? startTime.toISOString() : undefined,
      end: endTime ? endTime.toISOString() : undefined
    }

    if(timelog) {
      update({...data, timelogId: timelog.id}, {
        onSuccess: modal.hide
      });
    }
    else {
      create(data, {
        onSuccess: modal.hide
      });
    }
  }

  return (
    <Dialog open={modal.visible} onOpenChange={modal.hide}>
      <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
        <form onSubmit={submit}>
          
          <DialogHeader>
            <DialogTitle>{!timelog ? "New Time Log" : "Update Time Log"}</DialogTitle>
          </DialogHeader>

          <div className="my-6 flex flex-col gap-6">
            
            {/* Category select  */}
            <div className="grid gap-2">
              <Label htmlFor="title">
                <span>Category</span>
                { isPendingCategories ? <Spinner className='ml-2' /> : undefined }
              </Label>
              <Select value={categoryId} onValueChange={e => setCategoryId(e)} disabled={isPending}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories?.map(category => (
                      <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Description  */}
            <div className="grid gap-2">
              <Label htmlFor="description">
                Description
              </Label>
              <Textarea
                id="description"
                aria-description="Project description"
                value={description ? description : ''}
                onChange={e => setDescription(e.target.value)}
                disabled={isPending}
              />
            </div>

            {/* Start time */}
            <div className="grid gap-2">
              <Label htmlFor="categories">
                Start Time
              </Label>
              <DateTimePicker 
                value={startTime} 
                onChange={e => setStartTime(e)} 
                disabled={isPending} 
                preventClear
              />
            </div>

            {/* End time */}
            <div className="grid gap-2">
              <Label htmlFor="categories">
                End Time
              </Label>
              <DateTimePicker 
                value={endTime}
                onChange={e => setEndTime(e)}
                disabled={isPending} 
                preventClear
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit" isPending={isPending}>{timelog ? 'Update' : 'Create'}</Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
});

export default TimeLogEntryModal;
