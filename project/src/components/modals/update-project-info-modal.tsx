import NiceModal, { useModal } from '@ebay/nice-modal-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { Textarea } from '../ui/textarea';
import { Spinner } from '../ui/spinner';
import { useUpdateProjectInfoMutation } from '@/mutations/use-update-project-info-mutatin';
import { useProjectInfoQuery } from '@/queries/use-project-info-query';
import { Trash2 } from 'lucide-react';
import { useDeleteProjectMutation } from '@/mutations/use-delete-project-mutation';
import { useRouter } from 'next/navigation';

export const showUpdateProjectInfoModal = (projectId: string) => {
  NiceModal.show(UpdateProjectInfoModal, {projectId});
}

const UpdateProjectInfoModal = NiceModal.create(({projectId}: {projectId: string}) => {
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const modal = useModal();
  const router = useRouter();

  const {data: project, isPending: isPendingProject, error: errorProject} = useProjectInfoQuery(projectId);
  const {mutate, isPending} = useUpdateProjectInfoMutation();
  const {mutate: deleteProject, isPending: isPendingDelete} = useDeleteProjectMutation();

  useEffect(() => {
    let timeout: NodeJS.Timeout|undefined;
    if(!modal.visible) {
      timeout = setTimeout(() => {
        modal.remove();
      }, 500);
    }
    return () => clearTimeout(timeout);
  }, [modal.visible])

  useEffect(() => {
    if(!project)
      return;
    setTitle(project.title);
    setDescription(project.description || '');
  }, [project]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      projectId,
      title,
      description
    };

    mutate(data, {
      onSuccess: modal.hide
    });
  }

  const onDelete = () => {
    deleteProject({projectId}, {
      onSuccess: () => {
        modal.hide();
        router.push('/dashboard');
      }
    });
  }

  return (
    <Dialog open={modal.visible} onOpenChange={modal.hide}>
      <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
        <form onSubmit={submit}>
          <DialogHeader className='flex flex-row gap-4 items-center'>
            <DialogTitle>Update Project Info</DialogTitle>
            {isPendingProject ? <Spinner variant="dark" /> : undefined}
          </DialogHeader>

          <div className="my-6 flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                disabled={isPendingProject || isPending}
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                disabled={isPendingProject || isPending}
              />
            </div>
          </div>
          <DialogFooter className="flex flex-row justify-between sm:justify-between">
            <Button type="button" variant="link"
              disabled={isPendingDelete}
              onClick={onDelete}
            >
              {isPendingDelete ? <Spinner variant="dark" /> : <Trash2 /> }
              Delete
            </Button>
            <Button type="submit" disabled={isPendingProject} isPending={isPending}>Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});

export default UpdateProjectInfoModal;
