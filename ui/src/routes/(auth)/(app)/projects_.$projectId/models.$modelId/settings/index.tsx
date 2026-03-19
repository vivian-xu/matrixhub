import { createFileRoute } from '@tanstack/react-router'

import { ModelSettingsPage } from '@/features/models/pages/ModelSettingsPage'

export const Route = createFileRoute(
  '/(auth)/(app)/projects_/$projectId/models/$modelId/settings/',
)({
  component: ModelSettings,
})

function ModelSettings() {
  const {
    projectId, modelId,
  } = Route.useParams()

  return (
    <ModelSettingsPage
      projectId={projectId}
      modelId={modelId}
    />
  )
}
