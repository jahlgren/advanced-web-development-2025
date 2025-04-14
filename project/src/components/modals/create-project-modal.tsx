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
import { useCreateProjectMutation } from '@/mutations/create-project-mutation';

export const showCreateProjectModal = () => {
  NiceModal.show(CreateProjectModal, {});
}

const CreateProjectModal = NiceModal.create(() => {
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState('');

  const modal = useModal();
  const {mutate, isPending} = useCreateProjectMutation();

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

    const categoryArr = categories.replace(/\n/g, '').split(",");
    for(let i = categoryArr.length - 1; i >= 0; i--) {
      categoryArr[i] = categoryArr[i].trim();
      if(categoryArr[i] === '')
        categoryArr.splice(i, 1);
    }
    
    const data = {title, description, categories: categoryArr};
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
            <DialogTitle>Create a new project</DialogTitle>
          </DialogHeader>
          <div className="my-6 flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                aria-description="Project title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                disabled={isPending}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                aria-description="Project description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                disabled={isPending}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="categories" className="text-right">
                Categories
              </Label>
              <Textarea
                id="categories"
                aria-description="Project categories"
                value={categories}
                onChange={e => setCategories(e.target.value)}
                disabled={isPending}
              />
              <p className='italic tracking-tight text-foreground/50'>Enter categories as a comma-separated list (categories can also be added later.)</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" isPending={isPending}>Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});

export default CreateProjectModal;
