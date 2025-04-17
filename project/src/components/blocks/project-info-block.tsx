import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { dateToYearMonthDay } from "@/lib/date";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useProjectQuery } from "@/queries/use-project-query";
import { Error } from "../ui/error";

type ProjectInfoBlockProps = {
  projectId: string
}

function ProjectInfoSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          <Skeleton className="w-32 h-8" />  
        </CardTitle>
        <CardDescription>
          <Skeleton className="w-48 h-4" />  
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-start justify-between h-full">
        <Skeleton className="mt-2 mb-5 w-48 h-4" />
        <Skeleton className="w-18 h-9" />  
      </CardContent>
    </Card>
  )
}

export function ProjectInfoBlock({projectId}: ProjectInfoBlockProps) {
  const { data: project, isPending, error } = useProjectQuery(projectId)

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-start justify-between h-full">
          <Error message={error.message} />
        </CardContent>
      </Card>
    );
  }

  if(!isPending && !project) {
    return (
      <Card>
        <CardContent className="flex flex-col items-start justify-between h-full">
          <Error message="Unknown error." />
        </CardContent>
      </Card>
    );
  }

  if (isPending || !project) {
    return <ProjectInfoSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">{project.title}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-start justify-between h-full">
        <p><strong>Created At:</strong> {dateToYearMonthDay(project.createdAt)}</p>
        <Button variant="outline" className="mt-4">
          <Edit />
          Edit
        </Button>
      </CardContent>
    </Card>
  );
}