"use client";

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
import { Spinner } from '../ui/spinner';
import { Trash2 } from 'lucide-react';
import { useUpdateCategoryMutation } from '@/mutations/use-update-category-mutation';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator 
} from '../ui/dropdown-menu';
import { useCategoriesQuery } from '@/queries/use-categories-query';
import { Category } from '@/models/category';
import { useDeleteCategoryMutation } from '@/mutations/use-delete-category-mutation';

export const showUpdateCategoryModal = (projectId: string, categoryId: string, categoryName: string) => {
  NiceModal.show(UpdateCategoryModal, {projectId, categoryId, categoryName});
}

const UpdateCategoryModal = NiceModal.create(({projectId, categoryId, categoryName}: {projectId: string, categoryId: string, categoryName: string}) => {
  
  const [name, setName] = useState(categoryName);

  const modal = useModal();

  const {data: categories, isPending: isPendingCategories} = useCategoriesQuery(projectId);
  const {mutate, isPending} = useUpdateCategoryMutation();
  const {mutate: mutateDelete, isPending: isPendingDelete} = useDeleteCategoryMutation();

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

    const data = {
      projectId,
      categoryId,
      name
    };

    mutate(data, {
      onSuccess: modal.hide
    });
  }

  const onDelete = (replacementCategory: Category) => {
    mutateDelete({projectId, categoryId, replacementId: replacementCategory.id}, {
      onSuccess: () => {
        modal.hide();
      }
    });
  }

  return (
    <Dialog open={modal.visible} onOpenChange={modal.hide}>
      <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
        <form onSubmit={submit}>
          <DialogHeader className='flex flex-row gap-4 items-center'>
            <DialogTitle>Update Category</DialogTitle>
          </DialogHeader>

          <div className="my-6 flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                disabled={isPending}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter className="flex flex-row justify-between sm:justify-between">
            { categories && categories.length > 1 ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild disabled={isPendingCategories || isPendingDelete}>
                  <Button type="button" variant="link">
                    {(isPendingCategories || isPendingDelete) ? <Spinner variant="dark" /> : <Trash2 /> }
                    Delete
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='max-w-[180px]'>
                  <DropdownMenuLabel className='font-bold'>
                    Choose a new category for this category's timelogs.
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {categories?.map(c => c.id === categoryId ? undefined : (
                    <DropdownMenuItem
                      key={c.id}
                      className="cursor-pointer"
                      onClick={() => onDelete(c)}
                    >
                      {c.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : undefined }

            <Button type="submit" disabled={isPendingDelete} isPending={isPending}
              className='ml-auto mr-0'
            >Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});

export default UpdateCategoryModal;
