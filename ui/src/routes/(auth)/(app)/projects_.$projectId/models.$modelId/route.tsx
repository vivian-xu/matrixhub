import {
  Box,
  Button,
  Space,
  Tabs,
} from '@mantine/core'
import { Category, type Model } from '@matrixhub/api-ts/v1alpha1/model.pb.ts'
import {
  Outlet, Link, useMatchRoute, createFileRoute, linkOptions,
} from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import DownloadIcon from '@/assets/svgs/download.svg?react'
import UploadIcon from '@/assets/svgs/upload-cloud.svg?react'

import { DetailHeader } from '../-components/DetailHeader'

// TODO: Replace with real API data
const MOCK_DATA: Model = {
  labels: [
    {
      id: 1,
      name: '文本分类',
      category: Category.TASK,
      createdAt: '2024-01-01T12:00:00Z',
      updatedAt: '2024-01-01T12:00:00Z',
    },
  ],
  size: '595 GB',
  updatedAt: '2021-12-17 12:12',
}

export const Route = createFileRoute(
  '/(auth)/(app)/projects_/$projectId/models/$modelId',
)({
  component: ModelLayout,
  // loader: async ({ params }) => {
  //   const model = await Models.GetModel({
  //     project: params.projectId,
  //     name: params.modelId,
  //   })
  // },
  loader: async () => {
    return {
      model: MOCK_DATA,
    }
  },
})

function ModelLayout() {
  const { t } = useTranslation()

  const {
    projectId, modelId,
  } = Route.useParams()

  const { model } = Route.useLoaderData()

  const tabRoutes = linkOptions([
    {
      id: 'desc',
      label: t('model.detail.desc'),
      to: Route.to,
      params: {
        projectId,
        modelId,
      },
    },
    {
      id: 'tree',
      label: t('model.detail.tree'),
      to: '/projects/$projectId/models/$modelId/tree/$ref/$',
      params: {
        projectId,
        modelId,
        ref: 'testDsd',
        _splat: 'test/data',
      },
    },
    {
      id: 'settings',
      label: t('model.detail.setting'),
      to: '/projects/$projectId/models/$modelId/settings',
      params: {
        projectId,
        modelId,
      },
    },
  ])

  const matchRoute = useMatchRoute()

  const activeTab = tabRoutes.find(tab => matchRoute({
    to: tab.to,
  }))?.id || tabRoutes[0].id

  return (
    <>
      <Box>
        <DetailHeader
          projectId={projectId}
          name={modelId}
          size={model.size}
          updatedAt={model.updatedAt}
          labels={model.labels}
          actions={(
            <>
              <Button size="xs" leftSection={<UploadIcon />}>{t('model.upload')}</Button>
              <Button size="xs" leftSection={<DownloadIcon />}>{t('model.download')}</Button>
            </>
          )}
        />
      </Box>
      <Space h="1.5rem" />
      <Tabs value={activeTab}>
        <Tabs.List style={{ gap: 'var(--mantine-spacing-md)' }}>
          {
            tabRoutes.map(({
              id,
              label, ...linkProps
            }) => (
              <Tabs.Tab
                key={label}
                value={id}
                component={Link}
                fw={600}
                fz="sm"
                lh="xs"
                px="12px"
                py="8px"
                c={id === activeTab ? 'var(--mantine-color-gray-7)' : 'var(--mantine-color-gray-6)'}
                {...linkProps}
              >
                {label}
              </Tabs.Tab>
            ))
          }
        </Tabs.List>
      </Tabs>

      <Box>
        {
          activeTab === 'desc'
            ? (
                <div>
                  Description Page
                </div>
              )
            : <Outlet />
        }
      </Box>
    </>
  )
}
