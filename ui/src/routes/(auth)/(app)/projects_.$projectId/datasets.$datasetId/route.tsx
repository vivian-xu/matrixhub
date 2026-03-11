import {
  Tabs,
  Space,
  Stack,
  Group,
  Text,
  Badge,
  Button,
  CopyButton,
  ActionIcon,
  Tooltip,
  Box,
} from '@mantine/core'
import {
  Outlet,
  Link,
  createFileRoute,
  linkOptions,
  useMatchRoute,
} from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import {
  IconCopy,
  IconUpload,
  IconDownload,
  IconFile,
  IconLicense,
} from './-icons'

export const Route = createFileRoute(
  '/(auth)/(app)/projects_/$projectId/datasets/$datasetId',
)({
  component: DatasetLayout,
})

// TODO: Replace with real API data
interface DatasetMeta {
  taskCategory: string
  downloads: string
  license: string
  size: string
  updatedAt: string
}

const MOCK_META: DatasetMeta = {
  taskCategory: '文本分类',
  downloads: '2.14 k',
  license: 'apache-2.0',
  size: '595 GB',
  updatedAt: '2021-12-17 12:12',
}

function DataSetHeader({
  projectId,
  datasetId,
  meta = MOCK_META,
}: {
  projectId: string
  datasetId: string
  meta?: DatasetMeta
}) {
  const { t } = useTranslation()
  const fullName = `${projectId}/${datasetId}`

  return (
    <Stack gap={12}>
      {/* Row 1: Breadcrumb + Action buttons */}
      <Group justify="space-between" align="center">
        <Group gap="4" align="center">
          <Text
            component={Link}
            to={`/projects/${projectId}`}
            c="cyan.6"
            fw={500}
            size="lg"
            td="none"
            style={{ cursor: 'pointer' }}
          >
            {projectId}
          </Text>

          <Text c="dimmed" size="lg" w="1.5rem" ta="center" inline>/</Text>
          <Text size="lg">{datasetId}</Text>
          <CopyButton value={fullName} timeout={2000}>
            {({
              copied,
              copy,
            }) => (
              <Tooltip label={copied ? t('dataset.copied') : t('dataset.copyName')} withArrow>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  onClick={copy}
                  size={24}
                >
                  <IconCopy size={18} />
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </Group>

        <Group gap="sm">
          <Button
            variant="outline"
            size="xs"
            leftSection={<IconUpload />}
          >
            {t('dataset.uploadFiles')}
          </Button>
          <Button
            size="xs"
            leftSection={<IconDownload />}
          >
            {t('dataset.downloadDataset')}
          </Button>
        </Group>
      </Group>

      {/* Row 2: Badges */}
      <Group gap="sm">
        <Badge
          variant="light"
          color="gray"
          leftSection={<IconFile />}
          size="lg"
          radius="xl"
          fw={600}
        >
          {meta.taskCategory}
        </Badge>
        <Badge
          variant="light"
          color="gray"
          leftSection={<IconDownload />}
          size="lg"
          radius="xl"
          fw={600}
        >
          {meta.taskCategory}
        </Badge>
        <Badge
          variant="light"
          color="gray"
          leftSection={<IconDownload />}
          size="lg"
          radius="xl"
          fw={600}
        >
          {meta.downloads}
        </Badge>
        <Badge
          variant="light"
          color="gray"
          leftSection={<IconLicense />}
          size="lg"
          radius="xl"
          fw={600}
        >
          {meta.license}
        </Badge>
      </Group>

      {/* Row 3: Metadata */}
      <Group gap="xl">
        <Text size="sm" c="dimmed">
          {t('dataset.project')}
          ：
          {projectId}
        </Text>
        <Text size="sm" c="dimmed">
          {t('dataset.datasetSize')}
          ：
          {meta.size}
        </Text>
        <Text size="sm" c="dimmed">
          {t('dataset.updatedAt')}
          ：
          {meta.updatedAt}
        </Text>
      </Group>
    </Stack>
  )
}

function DatasetLayout() {
  const { t } = useTranslation()

  const {
    projectId, datasetId,
  } = Route.useParams()

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

  const getStyle = (id: string) => {
    return {
      color: id === activeTab ? 'var(--mantine-color-gray-7)' : 'var(--mantine-color-gray-6)',
      fontSize: 'var(--mantine-font-size-sm)',
      fontWeight: 600,
      lineHeight: 'var(--mantine-line-height-xs)',
      padding: '8px 12px',
    }
  }

  return (
    <>
      <Box>
        <DataSetHeader projectId={projectId} datasetId={datasetId} />
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
                style={getStyle(id)}
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
