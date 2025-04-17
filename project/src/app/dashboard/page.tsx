"use client";

import ProjectList from "@/components/blocks/project-list";
import { ProjectsBlock } from "@/components/blocks/projects-block";
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
      <ProjectsBlock />
    </>
  );
}
