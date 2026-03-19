import { Box } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'
import Markdown from 'react-markdown'

import { Route as ModelDetailRoute } from './route'

export const Route = createFileRoute('/(auth)/(app)/projects_/$projectId/models/$modelId/')({
  component: ModelDescription,
})

function ModelDescription() {
  const model = ModelDetailRoute.useLoaderData()

  return (
    <Box pt={20}>
      <Markdown>
        { model?.readmeContent }
      </Markdown>
    </Box>
  )
}
