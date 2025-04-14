"use client";

import ProjectList from "@/components/blocks/project-list";
import { showCreateProjectModal } from "@/components/modals/create-project-modal";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

export default function DashboardPage() {

  const router = useRouter();

  const onProjectSelect = (id: string) => {
    router.push('/dashboard/projects/' + id);
  }

  return (
    <>
      <Button variant="unstyled"
        className="mb-6 w-full h-12 border-dashed border-2 border-black/20 text-foreground/60 hover:text-primary hover:border-primary hover:bg-primary/5"
        onClick={showCreateProjectModal}
      >Create a new project...</Button>
      <ProjectList onProjectSelect={onProjectSelect} />
    </>
  );
}
