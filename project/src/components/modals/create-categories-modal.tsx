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
import { useCreateCategoriesMutation } from '@/mutations/use-create-categories-mutation';

export const showCreateCategoriesModal = (projectId: string) => {
  NiceModal.show(CreateCategoriesModal, {projectId});
}

const CreateCategoriesModal = NiceModal.create(({projectId}: {projectId: string}) => {
  
  const [categories, setCategories] = useState('');

  const modal = useModal();
  const {mutate, isPending} = useCreateCategoriesMutation();

  useEffect(() => {
    let timeout: NodeJS.Timeout|undefined;
    if(!modal.visible) {
      timeout = setTimeout(() => {
        modal.remove();
      }, 500);
    }
    return () => clearTimeout(timeout);
  }, [modal.visible])

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    const categoryArr = categories
      .replace(/\n/g, '')
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const data = {projectId, categories: categoryArr};
    mutate(data, {
      onSuccess: () => {
        modal.hide();
      }
    });
  }

  return (
    <Dialog open={modal.visible} onOpenChange={modal.hide}>
      <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>Create Categories</DialogTitle>
          </DialogHeader>
          <div className="my-6 flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="categories" className="text-right">
                Categories
              </Label>
              <Textarea
                id="categories"
                value={categories}
                onChange={e => setCategories(e.target.value)}
                disabled={isPending}
              />
              <p className='italic tracking-tight text-sm text-foreground/50'>Enter new categories as a comma-separated list</p>
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

export default CreateCategoriesModal;
