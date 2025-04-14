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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DateTimePicker } from '../ui/date-time-picker';
import { useCreateTimeLogMutation } from '@/mutations/create-timelog-mutation';
import { Project, Timelog } from '@/lib/types';
import { useUpdateTimeLogMutation } from '@/mutations/update-timelog-mutation';
import { desc } from 'drizzle-orm';

export const showTimeLogEntryModal = (project: Project, timelog?: Timelog) => {
  NiceModal.show(TimeLogEntryModal, {project, timelog});
}

const TimeLogEntryModal = NiceModal.create(({project, timelog}: {project: Project, timelog?: Timelog}) => {
  
  const [categoryId, setCategoryId] = useState(timelog ? timelog.categoryId : '');
  const [description, setDescription] = useState(timelog ? timelog.description : '');
  const [startTime, setStartTime] = useState<Date|null>(timelog ? new Date(timelog.start) : new Date());
  const [endTime, setEndTime] = useState<Date|null>(timelog && timelog.end ? new Date(timelog.end) : null);

  const modal = useModal();
  const {mutate: create, isPending: createIsPending} = useCreateTimeLogMutation();
  const {mutate: update, isPending: updateIsPending} = useUpdateTimeLogMutation();

  const isPending = createIsPending||updateIsPending;
  const mutate = timelog ? update : create;

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

  const close = async () => {
    modal.hide();
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if(isPending)
      return;

    const data = {
      projectId: project.id,
      timelogId: timelog?.id!,
      categoryId,
      description: description ? description : null,
      start: startTime ? startTime.toISOString() : null,
      end: endTime ? endTime.toISOString() : null
    };

    // @ts-ignore
    mutate(data, {
      onSuccess: () => {
        modal.hide();
      }
    });
  }

  return (
    <Dialog open={modal.visible} onOpenChange={close}>
      <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>{timelog ? "New Time Log" : "Update Time Log"}</DialogTitle>
          </DialogHeader>
          <div className="my-6 flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-right">
                Category
              </Label>
              <Select value={categoryId} onValueChange={e => setCategoryId(e)} disabled={isPending}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {project.categories?.map(category => (
                      <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                aria-description="Project description"
                value={description != null ? description : ''}
                onChange={e => setDescription(e.target.value)}
                disabled={isPending}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="categories" className="text-right">
                Start Time
              </Label>
              <DateTimePicker value={startTime} preventClear onChange={e => setStartTime(e)} disabled={isPending} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="categories" className="text-right">
                End Time
              </Label>
              <DateTimePicker value={endTime} onChange={e => setEndTime(e)} disabled={isPending} />
              {!timelog && <p className='italic tracking-tight text-foreground/50'>Optional, can be set later.</p>}
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
