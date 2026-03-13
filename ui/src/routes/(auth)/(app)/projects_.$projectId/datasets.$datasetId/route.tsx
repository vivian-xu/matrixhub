import {
  Box,
  Button,
  Space,
  Tabs,
} from '@mantine/core'
import { type Dataset } from '@matrixhub/api-ts/v1alpha1/dataset.pb.ts'
import { Category } from '@matrixhub/api-ts/v1alpha1/model.pb'
import {
  Outlet,
  Link,
  createFileRoute,
  linkOptions,
  useMatchRoute,
} from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import DownloadIcon from '@/assets/svgs/download.svg?react'
import UploadIcon from '@/assets/svgs/upload-cloud.svg?react'

import { DetailHeader } from '../-components/DetailHeader'

// TODO: Replace with real API data
const MOCK_DATA: Dataset = {
  size: '595 GB',
  updatedAt: '2021-12-17 12:12',
  labels: [
    {
      id: 1,
      name: '文本分类',
      category: Category.TASK,
      createdAt: '2024-01-01T12:00:00Z',
      updatedAt: '2024-01-01T12:00:00Z',
    },
  ],
}

export const Route = createFileRoute(
  '/(auth)/(app)/projects_/$projectId/datasets/$datasetId',
)({
  component: DatasetLayout,
  // loader: async ({ params }) => {
  //   const dataset = await Datasets.GetDataset({
  //     project: params.projectId,
  //     name: params.datasetId,
  //   })

  //   return {
  //     dataset,
  //   }
  // },
  loader: async () => {
    return {
      dataset: MOCK_DATA,
    }
  },
})

function DatasetLayout() {
  const { t } = useTranslation()

  const {
    projectId, datasetId,
  } = Route.useParams()

  const { dataset } = Route.useLoaderData()

  const tabRoutes = linkOptions([
    {
      id: 'desc',
      label: t('dataset.detail.desc'),
      to: Route.to,
      params: {
        projectId,
        datasetId,
      },
    },
    {
      id: 'tree',
      label: t('dataset.detail.tree'),
      to: '/projects/$projectId/datasets/$datasetId/tree/$ref/$',
      params: {
        projectId,
        datasetId,
        ref: 'testDsd',
        _splat: 'test/data',
      },
    },
    {
      id: 'settings',
      label: t('dataset.detail.setting'),
      to: '/projects/$projectId/datasets/$datasetId/settings',
      params: {
        projectId,
        datasetId,
      },
    },
  ])

  const matchRoute = useMatchRoute()

  const activeTab = tabRoutes.find(tab => matchRoute({
    to: tab.to,
  }))?.id || 'desc'

  return (
    <>
      <Box>
        <DetailHeader
          projectId={projectId}
          name={datasetId}
          size={dataset.size}
          updatedAt={dataset.updatedAt}
          labels={dataset.labels}
          actions={(
            <>
              <Button size="xs" leftSection={<UploadIcon />}>{t('dataset.uploadFiles')}</Button>
              <Button size="xs" leftSection={<DownloadIcon />}>{t('dataset.downloadDataset')}</Button>
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
      <Space h="md" />
      <div>
        {
          activeTab === 'desc'
            ? (
                <div>
                  Dataset Description Page
                </div>
              )
            : <Outlet />
        }
      </div>
    </>
  )
}
