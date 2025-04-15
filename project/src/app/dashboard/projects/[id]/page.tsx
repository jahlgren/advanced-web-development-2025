"use client";

import TimeLogs from '@/components/blocks/time-logs';
import { TimeSpentBlock } from '@/components/blocks/time-spent';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/ui/link';
import { PendingWrapper } from '@/components/ui/pending-wrapper';
import { useProjectQuery } from '@/queries/get-project-by-id-query';
import { ArrowLeft, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const router = useRouter();
  const {data, isPending, error} = useProjectQuery(id);

  return (
    <PendingWrapper 
      isPending={isPending} 
      error={error?.error || ((!isPending && !data) ? "No project data found.." : undefined)}
      action={
        <Link href="/dashboard" className="flex items-center gap-2 mt-2">
          <ArrowLeft size={16} />
          Go back
        </Link>
      }
    >
      <div className='mb-6 flex items-center justify-between'>
        <div className='flex gap-4 items-center'>
          <Button variant="outline" size="icon" onClick={() => router.push('/dashboard')}><ArrowLeft /> </Button>
          <h2 className='text-xl font-medium tracking-tight'>{data?.title}</h2>
        </div>
        <Button variant="outline" size="icon"><Pencil /></Button>
      </div>
      <TimeSpentBlock projectId={id} />
      {data && (
        <TimeLogs project={data!} />
      )}
    </PendingWrapper>
  );
}
