import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { dateToYearMonthDay } from "@/lib/date";
import { Button } from "../ui/button";
import { Edit, Plus, Tags } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Error } from "../ui/error";
import { showUpdateProjectInfoModal } from "../modals/update-project-info-modal";
import { useProjectInfoQuery } from "@/queries/use-project-info-query";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "../ui/dropdown-menu";
import { useCategoriesQuery } from "@/queries/use-categories-query";
import { showCreateCategoriesModal } from "../modals/create-categories-modal";
import { showUpdateCategoryModal } from "../modals/update-category-modal";

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
  const { data: project, isPending, error } = useProjectInfoQuery(projectId)

  const {data: categories, isPending: isPendingCategories} = useCategoriesQuery(projectId);

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
      </CardContent>
      <CardFooter className="flex gap-2 mt-4">
        <Button 
          variant="outline" 
          onClick={() => showUpdateProjectInfoModal(projectId)}
        >
          <Edit />
          Edit
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={isPendingCategories}>
            <Button type="button" variant="outline">
              <Tags />
              Categories
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {categories?.map(c => (
              <DropdownMenuItem
                key={c.id}
                className="cursor-pointer"
                onClick={() => showUpdateCategoryModal(projectId, c.id, c.name)}
              >
                {c.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={() => showCreateCategoriesModal(projectId)}
            >
              <Plus />
              Add Categories
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}