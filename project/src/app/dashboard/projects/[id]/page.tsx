"use client";

import { ProjectInfoBlock } from "@/components/blocks/project-info-block";
import { ProjectStatsBlock } from "@/components/blocks/project-stats-block";
import { TimelogControlBlock } from "@/components/blocks/timelog-control-block";
import TimelogHistoryBlock from "@/components/blocks/timelog-history-block";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params);

  const router = useRouter();
 
  return (
    <>
      <div className="-mt-4 mb-4">
        <Button variant="link" className="text-muted-foreground" onClick={() => router.push('/dashboard')}>
          <ArrowLeft className="mr-2" /> Back to Projects
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ProjectInfoBlock projectId={projectId} />
        <ProjectStatsBlock projectId={projectId} />
      </div>

      <TimelogControlBlock projectId={projectId} />

      <TimelogHistoryBlock projectId={projectId} />
    </>
  );
}
