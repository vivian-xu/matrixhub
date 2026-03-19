import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { membersQueryOptions } from '@/features/projects/members/members.query'
import { ProjectMembersPage } from '@/features/projects/members/pages/ProjectMembersPage'

// -- URL search schema (route concern) --

const membersSearchSchema = z.object({
  q: z.string().transform(v => v.trim()).catch(''),
  page: z.coerce.number().int().positive().catch(1),
})

// -- Route definition --

export const Route = createFileRoute(
  '/(auth)/(app)/projects/$projectId/members/',
)({
  validateSearch: membersSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({
    context,
    params,
    deps,
  }) => {
    await context.queryClient.ensureQueryData(
      membersQueryOptions(params.projectId, deps),
    )
  },
  component: RouteComponent,
})

// -- Component --

function RouteComponent() {
  return <ProjectMembersPage />
}
