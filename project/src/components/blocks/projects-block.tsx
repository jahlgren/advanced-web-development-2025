"use client"

import { useProjectsQuery } from "@/queries/use-projects-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PendingWrapper } from "@/components/ui/pending-wrapper"
import { useRouter } from "next/navigation"
import { showCreateProjectModal } from "../modals/create-project-modal"

export function ProjectsBlock() {
  const { data, isPending, error } = useProjectsQuery()
  const router = useRouter()

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-xl">Your Projects</CardTitle>
        <Button onClick={showCreateProjectModal}>New Project</Button>
      </CardHeader>
      <CardContent>
        <PendingWrapper isPending={isPending} error={error?.message}>
          <ul className="grid gap-3">
            {data && data.length === 0 && (
              <p className="text-muted-foreground text-sm">You don’t have any projects yet.</p>
            )}
            {data?.map((project) => (
              <li
                key={project.id}
                className="flex justify-between items-center border p-3 rounded-md hover:bg-muted transition cursor-pointer"
                onClick={() => router.push(`/dashboard/projects/${project.id}`)}
              >
                <div>
                  <div className="font-medium">{project.title}</div>
                  <div className="text-muted-foreground text-sm">{project.description}</div>
                </div>
              </li>
            ))}
          </ul>
        </PendingWrapper>
      </CardContent>
    </Card>
  )
}